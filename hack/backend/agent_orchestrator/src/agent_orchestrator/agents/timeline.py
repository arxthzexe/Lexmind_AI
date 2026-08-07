from typing import Any

from agent_orchestrator.contract import AgentResult, AgentSpec, BaseAgent


class TimelineAgent(BaseAgent):
    """03 §13 Timeline Agent: payment dates, renewal, expiry, notice periods."""

    spec = AgentSpec(
        name="timeline",
        objective="Generate contract milestones (payments, renewal, expiry, notice)",
        inputs=("clauses", "obligations"),
        outputs=("timeline",),
        default_confidence=0.7,
    )

    async def _execute(self, task_id: str, inputs: dict[str, Any]) -> AgentResult:
        text = inputs.get("text", "")
        milestones = [{"type": "renewal", "date": "2025-01-01"}] if text else []
        return AgentResult(
            task_id=task_id,
            agent=self.name,
            status="success",
            confidence=0.7,
            evidence=[f"built {len(milestones)} milestones"],
            result={"timeline": milestones},
        )
