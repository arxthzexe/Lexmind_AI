from __future__ import annotations

import logging
from typing import Any, TypedDict

from langgraph.graph import END, StateGraph

from agent_orchestrator.agents import AGENT_REGISTRY
from agent_orchestrator.consensus import Consensus, ConsensusEngine
from agent_orchestrator.contract import AgentResult
from agent_orchestrator.eventbus import EventBus, WorkflowEvent
from agent_orchestrator.memory import SharedMemory

logger = logging.getLogger("lexmind.coordinator")


class WorkflowState(TypedDict, total=False):
    task_id: str
    text: str
    filename: str
    phase: str
    results: list[dict[str, Any]]
    final: dict[str, Any] | None
    error: str | None


# Agent execution order (14 priority agents per 08 §Phase 5, then extras)
PIPELINE = [
    "intake",
    "ocr",
    "layout",
    "classification",
    "clause",
    "ner",
    "obligation",
    "risk",
    "compliance",
    "regulatory_intel",
    "timeline",
    "knowledge_graph",
    "graphrag",
    "negotiation",
    "report",
    "audit",
]

# Map agent completion -> workflow event (04 §Event Bus)
AGENT_EVENTS: dict[str, WorkflowEvent] = {
    "intake": WorkflowEvent.document_uploaded,
    "ocr": WorkflowEvent.ocr_completed,
    "layout": WorkflowEvent.layout_completed,
    "clause": WorkflowEvent.clause_completed,
    "ner": WorkflowEvent.ner_completed,
    "obligation": WorkflowEvent.ner_completed,
    "risk": WorkflowEvent.risk_completed,
    "compliance": WorkflowEvent.compliance_completed,
    "knowledge_graph": WorkflowEvent.graph_updated,
    "report": WorkflowEvent.report_generated,
    "audit": WorkflowEvent.audit_completed,
}


class Coordinator:
    """Chief Legal Officer: coordinates the full workflow via a LangGraph state machine."""

    def __init__(self, memory: SharedMemory | None = None, events: EventBus | None = None) -> None:
        self.memory = memory or SharedMemory()
        self.events = events or EventBus()
        self.consensus_engine = ConsensusEngine()
        self.graph = self._build_graph()

    def _build_graph(self) -> Any:
        g = StateGraph(WorkflowState)

        def _make_node(agent_name: str):
            async def node(state: WorkflowState) -> WorkflowState:
                agent = AGENT_REGISTRY[agent_name]
                inputs = _agent_inputs(agent_name, state)
                result = await agent.run(state["task_id"], inputs)  # type: ignore[attr-defined]
                results = state.get("results", [])
                results.append(result.model_dump())
                if agent_name in AGENT_EVENTS:
                    await self.events.publish(
                        AGENT_EVENTS[agent_name], {"task_id": state["task_id"], "agent": agent_name}
                    )
                return {"results": results}

            return node

        prev: str | None = None
        for agent_name in PIPELINE:
            g.add_node(agent_name, _make_node(agent_name))
            if prev is not None:
                g.add_edge(prev, agent_name)
            prev = agent_name
        assert prev is not None
        g.add_edge(prev, END)
        g.set_entry_point(PIPELINE[0])
        return g.compile()

    async def execute(
        self, task_id: str, text: str, filename: str = "document.txt"
    ) -> dict[str, Any]:
        await self.events.publish(WorkflowEvent.document_uploaded, {"task_id": task_id})
        self.memory.set(f"task:{task_id}:text", text)

        initial: WorkflowState = {
            "task_id": task_id,
            "text": text,
            "filename": filename,
            "phase": "INIT",
            "results": [],
        }
        final_state = await self.graph.ainvoke(initial)

        results = [AgentResult(**r) for r in final_state.get("results", [])]
        consensus: Consensus = self.consensus_engine.reach(results)

        report = next((r for r in results if r.agent == "report"), None)
        audit = next((r for r in results if r.agent == "audit"), None)

        final: dict[str, Any] = {
            "task_id": task_id,
            "consensus": consensus.to_dict(),
            "report": report.result.get("report") if report else None,
            "audit_trail": audit.result.get("audit_trail") if audit else None,
            "event_history": [e["event"] for e in self.events.history()],
        }
        self.memory.set(f"task:{task_id}:final", final)
        return final


def _agent_inputs(agent_name: str, state: WorkflowState) -> dict[str, Any]:
    """Map shared workflow state to each agent's inputs (doc 03 inputs)."""
    text = state.get("text", "")
    results = state.get("results", [])
    by_agent = {r.get("agent"): r.get("result", {}) for r in results}
    common = {"text": text, "filename": state.get("filename", "")}
    if agent_name == "intake":
        return {**common, "content_type": "text/plain", "size": len(text)}
    if agent_name == "graphrag":
        return {**common, "query": "contract review", "retrieved": []}
    if agent_name == "report":
        return {
            **common,
            "risks": by_agent.get("risk", {}).get("risks", []),
            "clauses": by_agent.get("clause", {}).get("clauses", []),
            "compliance_report": by_agent.get("compliance", {}),
            "timeline": by_agent.get("timeline", {}).get("timeline", []),
        }
    if agent_name == "audit":
        return {"agent_results": results}
    if agent_name in ("comparison",):
        return {**common, "contract_a": text, "contract_b": ""}
    return common
