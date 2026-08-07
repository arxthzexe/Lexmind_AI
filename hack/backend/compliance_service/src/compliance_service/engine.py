from __future__ import annotations

import re
from enum import StrEnum

from pydantic import BaseModel
from shared.llm import LlmClient


class ComplianceSeverity(StrEnum):
    info = "Info"
    warning = "Warning"
    violation = "Violation"


class ComplianceCheck(BaseModel):
    policy: str
    status: ComplianceSeverity
    message: str
    clause_ref: str | None = None
    confidence: float = 0.0


# Baseline policy rules: what must exist for an organization's compliance posture.
_POLICY_RULES: tuple[tuple[str, str, bool], ...] = (
    ("Data Protection", r"\b(?:data protection|personal data|GDPR|CCPA)\b", True),
    ("Confidentiality", r"\b(?:confidentiality|non-disclosure)\b", True),
    ("Termination", r"\b(?:termination|terminate)\b", True),
    ("Governing Law", r"\b(?:governing law|jurisdiction)\b", True),
    ("Payment Terms", r"\b(?:payment|fee|invoice|consideration)\b", True),
    ("Liability Cap", r"\b(?:liability|cap on liability|limitation of liability)\b", False),
    ("Force Majeure", r"\bforce majeure\b", False),
    ("Arbitration", r"\barbitration\b", False),
)


class ComplianceEngine:
    def __init__(self, llm: LlmClient | None = None) -> None:
        self._llm = llm

    def validate(self, text: str) -> list[ComplianceCheck]:
        lowered = text.lower()
        checks: list[ComplianceCheck] = []
        for policy, pattern, required in _POLICY_RULES:
            found = re.search(pattern, lowered) is not None
            if required and not found:
                checks.append(
                    ComplianceCheck(
                        policy=policy,
                        status=ComplianceSeverity.violation,
                        message=f"Required clause '{policy}' is missing",
                        confidence=0.8,
                    )
                )
            elif found:
                checks.append(
                    ComplianceCheck(
                        policy=policy,
                        status=ComplianceSeverity.info,
                        message=f"Clause '{policy}' present",
                        confidence=0.8,
                    )
                )
        if not checks:
            checks.append(
                ComplianceCheck(
                    policy="General",
                    status=ComplianceSeverity.info,
                    message="No issues found",
                    confidence=0.6,
                )
            )
        return checks

    async def validate_llm(self, text: str) -> list[ComplianceCheck]:
        if self._llm is None:
            return self.validate(text)
        prompt = (
            "Validate the contract against internal compliance policies. "
            "Return JSON: [{\"policy\",\"status\",\"message\",\"clause_ref\",\"confidence\"}] "
            "where status is Info, Warning, or Violation.\n\n"
            f"TEXT:\n{text[:3000]}"
        )
        data = await self._llm.structured(prompt)
        out: list[ComplianceCheck] = []
        items = data if isinstance(data, list) else data.get("checks", [])
        for item in items:
            out.append(ComplianceCheck(**item))
        return out or self.validate(text)
