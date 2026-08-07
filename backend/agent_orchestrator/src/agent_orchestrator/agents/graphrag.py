from typing import Any

from agent_orchestrator.contract import AgentResult, AgentSpec, BaseAgent


class GraphRagAgent(BaseAgent):
    """03 §15 GraphRAG Agent: vector + knowledge graph + policies + history."""

    spec = AgentSpec(
        name="graphrag",
        objective="Retrieve grounded context using hybrid GraphRAG",
        inputs=("query",),
        outputs=("retrieved_context", "explainability"),
        tools=("hybrid_retriever", "qdrant", "neo4j"),
        default_confidence=0.65,
    )

    async def _execute(self, task_id: str, inputs: dict[str, Any]) -> AgentResult:
        query = inputs.get("query", "")
        hits = inputs.get("retrieved", [])
        return AgentResult(
            task_id=task_id,
            agent=self.name,
            status="success",
            confidence=0.65,
            evidence=[f"retrieved {len(hits)} chunks for '{query}'"],
            result={
                "context": hits,
                "explainability": {"sources": [h.get("text", "")[:50] for h in hits]},
            },
        )
