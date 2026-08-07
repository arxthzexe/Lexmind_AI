from __future__ import annotations

from enum import StrEnum

from pydantic import BaseModel
from shared.llm import LlmClient


class RiskCategory(StrEnum):
    legal = "Legal"
    commercial = "Commercial"
    financial = "Financial"
    operational = "Operational"
    compliance = "Compliance"


class RiskSeverity(StrEnum):
    low = "Low"
    medium = "Medium"
    high = "High"
    critical = "Critical"


class Risk(BaseModel):
    id: str
    category: RiskCategory
    severity: RiskSeverity
    description: str
    clause_ref: str | None = None
    confidence: float = 0.0


_RISK_CUES: dict[RiskCategory, tuple[tuple[str, RiskSeverity], ...]] = {
    RiskCategory.legal: (
        ("unlimited liability", RiskSeverity.high),
        ("indemnification", RiskSeverity.medium),
        ("governing law", RiskSeverity.low),
        ("jurisdiction", RiskSeverity.medium),
    ),
    RiskCategory.financial: (
        ("late payment", RiskSeverity.medium),
        ("penalty", RiskSeverity.medium),
        ("termination for convenience", RiskSeverity.high),
        ("price increase", RiskSeverity.high),
    ),
    RiskCategory.commercial: (
        ("exclusivity", RiskSeverity.medium),
        ("non-compete", RiskSeverity.medium),
        ("renewal", RiskSeverity.low),
    ),
    RiskCategory.operational: (
        ("service level", RiskSeverity.medium),
        ("sla", RiskSeverity.medium),
        ("delivery schedule", RiskSeverity.low),
    ),
    RiskCategory.compliance: (
        ("gdp", RiskSeverity.medium),
        ("regulatory", RiskSeverity.high),
        ("data protection", RiskSeverity.critical),
    ),
}


class RiskAssessor:
    def __init__(self, llm: LlmClient | None = None) -> None:
        self._llm = llm

    def assess(self, text: str) -> list[Risk]:
        risks: list[Risk] = []
        lowered = text.lower()
        for category, cues in _RISK_CUES.items():
            for cue, severity in cues:
                if cue in lowered:
                    risks.append(
                        Risk(
                            id=f"risk-{category.value.lower().replace(' ', '-')}",
                            category=category,
                            severity=severity,
                            description=f"Contract contains '{cue}' provision",
                            confidence=0.65,
                        )
                    )
        return risks

    async def assess_llm(self, text: str) -> list[Risk]:
        if self._llm is None:
            return self.assess(text)
        prompt = (
            "Assess the contract for risks. For each risk return JSON: "
            '[{"id","category","severity","description","clause_ref","confidence"}] '
            "where category is one of Legal, Commercial, Financial, Operational, "
            "Compliance and severity is Low, Medium, High, Critical.\n\n"
            f"TEXT:\n{text[:3000]}"
        )
        data = await self._llm.structured(prompt)
        out: list[Risk] = []
        items = data if isinstance(data, list) else data.get("risks", [])
        for item in items:
            out.append(Risk(**item))
        return out or self.assess(text)
