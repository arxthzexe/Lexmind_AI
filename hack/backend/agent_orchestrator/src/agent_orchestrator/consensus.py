from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from agent_orchestrator.contract import AgentResult


@dataclass
class Consensus:
    recommendation: str
    confidence: float
    supporting_evidence: list[str]
    per_agent: list[AgentResult]

    def to_dict(self) -> dict[str, Any]:
        return {
            "recommendation": self.recommendation,
            "confidence": self.confidence,
            "supporting_evidence": self.supporting_evidence,
            "per_agent": [r.model_dump() for r in self.per_agent],
        }


class ConsensusEngine:
    """04 §Consensus Engine: weighted confidence + evidence completeness."""

    WEIGHT = 0.7
    EVIDENCE_WEIGHT = 0.3

    def reach(self, results: list[AgentResult]) -> Consensus:
        if not results:
            return Consensus("No agent output", 0.0, [], [])
        successes = [r for r in results if r.status == "success"]
        if not successes:
            return Consensus("All agents failed", 0.0, [], results)

        avg_confidence = sum(r.confidence for r in successes) / len(successes)
        with_evidence = sum(1 for r in successes if r.evidence)
        evidence_completeness = with_evidence / len(successes)

        score = (
            self.WEIGHT * avg_confidence
            + self.EVIDENCE_WEIGHT * evidence_completeness
        )
        evidence: list[str] = []
        for r in successes:
            evidence.extend(r.evidence)

        if score >= 0.75:
            recommendation = "APPROVE"
        elif score >= 0.5:
            recommendation = "REVIEW"
        else:
            recommendation = "ESCALATE"

        return Consensus(recommendation, round(score, 2), evidence, results)
