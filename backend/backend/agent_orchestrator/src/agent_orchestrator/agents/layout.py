from typing import Any

from agent_orchestrator.contract import AgentResult, AgentSpec, BaseAgent


class LayoutAgent(BaseAgent):
    """03 §4 Layout Analysis Agent: headings, clause boundaries, tables, annexures."""

    spec = AgentSpec(
        name="layout",
        objective="Build a structured layout tree from OCR output",
        inputs=("ocr_result",),
        outputs=("layout_tree",),
        tools=("layout_engine",),
        default_confidence=0.7,
    )

    async def _execute(self, task_id: str, inputs: dict[str, Any]) -> AgentResult:
        text = inputs.get("text", "")
        nodes = sum(1 for line in text.splitlines() if line.strip())
        return AgentResult(
            task_id=task_id,
            agent=self.name,
            status="success",
            confidence=0.7,
            evidence=[f"detected {nodes} layout lines"],
            result={"layout_tree": {"pages": 1, "nodes": nodes}},
        )
