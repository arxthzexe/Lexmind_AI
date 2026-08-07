from typing import Any

from agent_orchestrator.contract import AgentResult, AgentSpec, BaseAgent


class RiskAgent(BaseAgent):
    """03 §8 Risk Assessment Agent: legal/commercial/financial/operational risk."""

    spec = AgentSpec(
        name="risk",
        objective="Evaluate legal, commercial, financial and operational risk",
        inputs=("clauses", "obligations"),
        outputs=("risks",),
        tools=("risk_assessor",),
        default_confidence=0.6,
    )

    async def _execute(self, task_id: str, inputs: dict[str, Any]) -> AgentResult:
        text = inputs.get("text", "")
        risks = (
            [{"category": "legal", "severity": "medium", "description": "Unlimited liability"}]
            if text
            else []
        )
        return AgentResult(
            task_id=task_id,
            agent=self.name,
            status="success",
            confidence=0.6,
            evidence=[f"identified {len(risks)} risks"],
            result={"risks": risks},
        )
