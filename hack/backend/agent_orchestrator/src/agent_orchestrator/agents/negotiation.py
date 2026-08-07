from typing import Any

from agent_orchestrator.contract import AgentResult, AgentSpec, BaseAgent


class NegotiationAgent(BaseAgent):
    """03 §12 Negotiation Agent: risk explanations, alternatives, redlining."""

    spec = AgentSpec(
        name="negotiation",
        objective="Generate risk explanations, alternative wording and redline suggestions",
        inputs=("risks", "clauses"),
        outputs=("suggestions", "redlines"),
        tools=("llm",),
        default_confidence=0.55,
    )

    async def _execute(self, task_id: str, inputs: dict[str, Any]) -> AgentResult:
        text = inputs.get("text", "")
        suggestions = [{"type": "redline", "text": "Recommend capping liability"}] if text else []
        return AgentResult(
            task_id=task_id,
            agent=self.name,
            status="success",
            confidence=0.55,
            evidence=[f"generated {len(suggestions)} suggestions"],
            result={"suggestions": suggestions, "redlines": suggestions},
        )
