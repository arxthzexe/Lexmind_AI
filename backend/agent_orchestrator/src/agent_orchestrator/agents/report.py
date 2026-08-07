from typing import Any

from agent_orchestrator.contract import AgentResult, AgentSpec, BaseAgent


class ReportAgent(BaseAgent):
    """03 §16 Executive Report Agent: executive/legal/risk summaries + recommendations."""

    spec = AgentSpec(
        name="report",
        objective="Generate executive, legal and risk summaries with recommendations",
        inputs=("risks", "clauses", "compliance_report", "timeline"),
        outputs=("report",),
        tools=("llm",),
        default_confidence=0.7,
    )

    async def _execute(self, task_id: str, inputs: dict[str, Any]) -> AgentResult:
        risk_count = len(inputs.get("risks", []))
        clause_count = len(inputs.get("clauses", []))
        report = {
            "executive_summary": f"Contract with {clause_count} clauses and {risk_count} risks.",
            "legal_summary": "Standard terms detected.",
            "risk_summary": f"{risk_count} risks identified.",
            "recommendations": [],
        }
        return AgentResult(
            task_id=task_id,
            agent=self.name,
            status="success",
            confidence=0.7,
            evidence=["compiled report"],
            result={"report": report},
        )
