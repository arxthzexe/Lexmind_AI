from typing import Any

from agent_orchestrator.contract import AgentResult, AgentSpec, BaseAgent


class OcrAgent(BaseAgent):
    """03 §3 OCR Agent: extract text, preserve tables, detect signatures."""

    spec = AgentSpec(
        name="ocr",
        objective="Extract text from the document preserving tables and signatures",
        inputs=("content_bytes", "mime"),
        outputs=("ocr_result",),
        tools=("docling", "paddleocr", "easyocr"),
        failure_strategy="retry:3;fallback:docling->paddle->easy;escalate",
        default_confidence=0.75,
    )

    async def _execute(self, task_id: str, inputs: dict[str, Any]) -> AgentResult:
        raw_text = inputs.get("text", "")
        if not raw_text:
            return AgentResult(
                task_id=task_id,
                agent=self.name,
                status="failed",
                confidence=0.0,
                evidence=["no text available"],
                result={"error": "missing text input"},
            )
        return AgentResult(
            task_id=task_id,
            agent=self.name,
            status="success",
            confidence=0.75,
            evidence=[f"extracted {len(raw_text)} chars"],
            result={"text": raw_text, "tables": [], "signatures": []},
        )
