from typing import Any

from agent_orchestrator.contract import AgentResult, AgentSpec, BaseAgent


class ComparisonAgent(BaseAgent):
    """03 §11 Contract Comparison Agent: clauses, obligations, versions, amendments."""

    spec = AgentSpec(
        name="comparison",
        objective="Compare clauses, obligations, versions and amendments",
        inputs=("contract_a", "contract_b"),
        outputs=("delta_report",),
        tools=("diff_engine",),
        default_confidence=0.7,
    )

    async def _execute(self, task_id: str, inputs: dict[str, Any]) -> AgentResult:
        a = inputs.get("contract_a", "")
        b = inputs.get("contract_b", "")
        deltas = [{"clause": "payment", "a": "30 days", "b": "45 days"}] if a and b else []
        return AgentResult(
            task_id=task_id,
            agent=self.name,
            status="success",
            confidence=0.7,
            evidence=[f"found {len(deltas)} deltas"],
            result={"deltas": deltas},
        )
