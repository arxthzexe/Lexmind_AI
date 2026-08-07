from __future__ import annotations

import re

from pydantic import BaseModel
from shared.llm import LlmClient


class Obligation(BaseModel):
    id: str
    actor: str
    action: str
    object: str | None = None
    deadline: str | None = None
    condition: str | None = None
    penalty: str | None = None
    confidence: float = 0.0
    source: str | None = None


# Deterministic patterns: "X shall/must/will Y" + deadline/penalty cues
_OBLIGATION_RE = re.compile(
    r"([\w\s]+?)\s+(shall|must|will|is obligated to|agrees to)\s+(.+?)(?:\.|;)"
    r"(?:\s*([Tt]erms?\s*[:/]|[Bb]y\s+)?"
    r"(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|[A-Z][a-z]+ \d{1,2}, \d{4}|within \d+ days?))?",
    re.I,
)
_DEADLINE_RE = re.compile(
    r"(by\s+)?(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|[A-Z][a-z]+ \d{1,2}, \d{4}|within \d+ days?)",
    re.I,
)
_PENALTY_RE = re.compile(
    r"(penalty|late fee|interest rate|damages) of? ?(\$?[\d,]+(?:\.\d{2})?%?)?", re.I
)


class ObligationExtractor:
    def __init__(self, llm: LlmClient | None = None) -> None:
        self._llm = llm

    def extract(self, text: str) -> list[Obligation]:
        obligations: list[Obligation] = []
        for i, match in enumerate(_OBLIGATION_RE.finditer(text), start=1):
            actor, _modal, action, _, raw_deadline = match.groups()
            deadline = _extract_deadline(action) or (raw_deadline or "")
            penalty = _extract_penalty(action)
            obligations.append(
                Obligation(
                    id=f"oblig-{i}",
                    actor=actor.strip(),
                    action=action.strip(),
                    deadline=deadline or None,
                    penalty=penalty,
                    confidence=0.7,
                    source=match.group(0),
                )
            )
        # Standalone penalty/late-fee sentences that don't match the modal pattern
        for j, sentence in enumerate(re.split(r"(?<=[.!?])\s+", text), start=1):
            if _PENALTY_RE.search(sentence) and not any(o.source == sentence for o in obligations):
                obligations.append(
                    Obligation(
                        id=f"oblig-penalty-{j}",
                        actor="",
                        action=sentence.strip(),
                        penalty=_extract_penalty(sentence),
                        confidence=0.6,
                        source=sentence,
                    )
                )
        return obligations

    async def extract_llm(self, text: str) -> list[Obligation]:
        if self._llm is None:
            return self.extract(text)
        prompt = (
            "Extract obligations from the contract. Each obligation has "
            "actor, action, object, deadline, condition, penalty. Return JSON: "
            '[{"id","actor","action","object","deadline","condition","penalty","confidence"}].\n\n'
            f"TEXT:\n{text[:3000]}"
        )
        data = await self._llm.structured(prompt)
        out: list[Obligation] = []
        items = data if isinstance(data, list) else data.get("obligations", [])
        for item in items:
            out.append(Obligation(**item))
        return out or self.extract(text)


def _extract_deadline(text: str) -> str | None:
    match = _DEADLINE_RE.search(text)
    return match.group(0).strip() if match else None


def _extract_penalty(text: str) -> str | None:
    match = _PENALTY_RE.search(text)
    return match.group(0).strip() if match else None
