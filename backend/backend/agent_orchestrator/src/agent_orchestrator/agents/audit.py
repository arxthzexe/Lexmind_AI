from typing import Any

from agent_orchestrator.contract import AgentResult, AgentSpec, BaseAgent


class AuditAgent(BaseAgent):
    """03 §17 Audit Agent: decision trace, AI reasoning, version history, user actions."""

    spec = AgentSpec(
        name="audit",
        objective="Record decision trace, AI reasoning, version history and user actions",
        inputs=("agent_results",),
        outputs=("audit_trail",),
        default_confidence=1.0,
    )

    async def _execute(self, task_id: str, inputs: dict[str, Any]) -> AgentResult:
        results = inputs.get("agent_results", [])
        trail = [{"agent": r.get("agent"), "status": r.get("status")} for r in results]
        return AgentResult(
            task_id=task_id,
            agent=self.name,
            status="success",
            confidence=1.0,
            evidence=[f"recorded {len(trail)} agent decisions"],
            result={"audit_trail": trail},
        )
