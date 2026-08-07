from __future__ import annotations

from enum import StrEnum
from typing import Any

from pydantic import BaseModel, Field


class TwinLifecycle(StrEnum):
    draft = "Draft"
    review = "Review"
    negotiation = "Negotiation"
    approved = "Approved"
    signed = "Signed"
    active = "Active"
    amended = "Amended"
    renewed = "Renewed"
    expired = "Expired"
    archived = "Archived"


_LIFECYCLE_ORDER: list[TwinLifecycle] = [
    TwinLifecycle.draft,
    TwinLifecycle.review,
    TwinLifecycle.negotiation,
    TwinLifecycle.approved,
    TwinLifecycle.signed,
    TwinLifecycle.active,
    TwinLifecycle.amended,
    TwinLifecycle.renewed,
    TwinLifecycle.expired,
    TwinLifecycle.archived,
]


class TwinEvent(BaseModel):
    event_type: str
    actor: str | None = None
    details: dict[str, Any] = Field(default_factory=dict)
    timestamp: str | None = None


class ContractTwin(BaseModel):
    contract_id: str
    lifecycle: TwinLifecycle = TwinLifecycle.draft
    parties: list[str] = Field(default_factory=list)
    clauses: list[dict[str, Any]] = Field(default_factory=list)
    obligations: list[dict[str, Any]] = Field(default_factory=list)
    risks: list[dict[str, Any]] = Field(default_factory=list)
    timeline: list[dict[str, Any]] = Field(default_factory=list)
    events: list[TwinEvent] = Field(default_factory=list)
    risk_history: list[float] = Field(default_factory=list)


class TwinStore:
    """In-memory Digital Contract Twin store (07 §DCT)."""

    def __init__(self) -> None:
        self._twins: dict[str, ContractTwin] = {}

    def get(self, contract_id: str) -> ContractTwin | None:
        return self._twins.get(contract_id)

    def ensure(self, contract_id: str) -> ContractTwin:
        twin = self._twins.setdefault(contract_id, ContractTwin(contract_id=contract_id))
        return twin

    def apply_event(self, contract_id: str, event: TwinEvent) -> ContractTwin:
        twin = self.ensure(contract_id)
        twin.events.append(event)
        if event.event_type.lower() in ("sign", "approved"):
            twin.lifecycle = TwinLifecycle.signed
        elif event.event_type.lower() == "amendment":
            twin.lifecycle = TwinLifecycle.amended
        elif event.event_type.lower() == "renewal":
            twin.lifecycle = TwinLifecycle.renewed
        elif event.event_type.lower() == "expiry":
            twin.lifecycle = TwinLifecycle.expired
        twin.risk_history.append(sum(r.get("severity_score", 0) for r in twin.risks))
        return twin

    def simulate(self, contract_id: str, scenario: str) -> dict[str, Any]:
        """07 §Simulation: what-if impact analysis (deterministic baseline)."""
        twin = self.ensure(contract_id)
        impacted = [o for o in twin.obligations]
        base_risk = sum(r.get("severity_score", 0) for r in twin.risks)
        new_risk = base_risk + (1 if scenario != "noop" else 0)
        return {
            "scenario": scenario,
            "impacted_obligations": len(impacted),
            "new_risk_score": new_risk,
            "compliance_impact": "review",
            "recommended_actions": ["review affected clauses", "notify stakeholders"],
        }
