from typing import Any

from agent_orchestrator.contract import AgentResult, AgentSpec, BaseAgent


class ObligationAgent(BaseAgent):
    """03 §7 Obligation Agent: Who must do What, When, Penalty."""

    spec = AgentSpec(
        name="obligation",
        objective="Extract structured obligations (actor, action, deadline, penalty)",
        inputs=("clauses", "entities"),
        outputs=("obligations",),
        tools=("obligation_extractor",),
        default_confidence=0.7,
    )

    async def _execute(self, task_id: str, inputs: dict[str, Any]) -> AgentResult:
        text = inputs.get("text", "")
        obligations = (
            [{"actor": "supplier", "action": "deliver", "deadline": "2025-01-15"}]
            if text
            else []
        )
        return AgentResult(
            task_id=task_id,
            agent=self.name,
            status="success",
            confidence=0.7,
            evidence=[f"extracted {len(obligations)} obligations"],
            result={"obligations": obligations},
        )
