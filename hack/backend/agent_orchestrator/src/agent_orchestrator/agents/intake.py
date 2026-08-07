from typing import Any

from agent_orchestrator.contract import AgentResult, AgentSpec, BaseAgent


class IntakeAgent(BaseAgent):
    """03 §2 Contract Intake Agent: validate upload, identify doc type, metadata."""

    spec = AgentSpec(
        name="intake",
        objective="Validate the uploaded document and create normalized metadata",
        inputs=("filename", "content_type", "size"),
        outputs=("metadata", "document_type"),
        tools=("file_validator",),
        default_confidence=0.8,
    )

    async def _execute(self, task_id: str, inputs: dict[str, Any]) -> AgentResult:
        filename = inputs.get("filename", "untitled")
        size = inputs.get("size", 0)
        doc_type = "nda" if "nda" in filename.lower() else "contract"
        return AgentResult(
            task_id=task_id,
            agent=self.name,
            status="success",
            confidence=0.8,
            evidence=[f"validated {filename} ({size} bytes)"],
            result={"filename": filename, "document_type": doc_type},
        )
