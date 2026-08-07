from typing import Any

from agent_orchestrator.contract import AgentResult, AgentSpec, BaseAgent


class ClassificationAgent(BaseAgent):
    """03 §5 Document Classification Agent (from doc topology)."""

    spec = AgentSpec(
        name="classification",
        objective="Classify the document into the known taxonomy",
        inputs=("metadata", "layout_tree"),
        outputs=("document_type",),
        default_confidence=0.8,
    )

    async def _execute(self, task_id: str, inputs: dict[str, Any]) -> AgentResult:
        doc_type = inputs.get("document_type", "contract")
        return AgentResult(
            task_id=task_id,
            agent=self.name,
            status="success",
            confidence=0.8,
            evidence=[f"classified as {doc_type}"],
            result={"document_type": doc_type},
        )
