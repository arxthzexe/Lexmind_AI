from typing import Any

from agent_orchestrator.contract import AgentResult, AgentSpec, BaseAgent


class ClauseAgent(BaseAgent):
    """03 §5 Clause Intelligence Agent: detect and classify clause types."""

    spec = AgentSpec(
        name="clause",
        objective="Segment and classify clauses by type",
        inputs=("layout_tree", "ocr_result"),
        outputs=("clauses",),
        tools=("clause_classifier",),
        default_confidence=0.65,
    )

    async def _execute(self, task_id: str, inputs: dict[str, Any]) -> AgentResult:
        text = inputs.get("text", "")
        clauses = [{"id": "clause-1", "type": "payment", "text": text[:200]}] if text else []
        return AgentResult(
            task_id=task_id,
            agent=self.name,
            status="success",
            confidence=0.65,
            evidence=[f"found {len(clauses)} clauses"],
            result={"clauses": clauses},
        )
