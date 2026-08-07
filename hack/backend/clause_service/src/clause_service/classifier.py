from __future__ import annotations

import re
from enum import StrEnum

from pydantic import BaseModel
from shared.llm import LlmClient


class ClauseType(StrEnum):
    payment = "Payment"
    confidentiality = "Confidentiality"
    termination = "Termination"
    liability = "Liability"
    indemnity = "Indemnity"
    force_majeure = "Force Majeure"
    ip = "Intellectual Property"
    arbitration = "Arbitration"
    warranty = "Warranty"
    governing_law = "Governing Law"
    unknown = "Unknown"


_KEYWORDS: dict[ClauseType, tuple[str, ...]] = {
    ClauseType.payment: ("payment", "fee", "invoice", "consideration", "compensation", "settle"),
    ClauseType.confidentiality: ("confidential", "non-disclosure", "nda", "secret", "proprietary"),
    ClauseType.termination: ("terminate", "termination", "rescind", "cancel", "expiry"),
    ClauseType.liability: ("liability", "liable", "owe", "damages", "loss", "cap on"),
    ClauseType.indemnity: ("indemnify", "indemnification", "hold harmless", "indemnitor"),
    ClauseType.force_majeure: (
        "force majeure",
        "act of god",
        "extraordinary event",
        "beyond reasonable control",
    ),
    ClauseType.ip: ("intellectual property", "trademark", "patent", "copyright", "license"),
    ClauseType.arbitration: ("arbitrat", "tribunal", "dispute resolution"),
    ClauseType.warranty: ("warranty", "warranties", "warrants", "merchantability", "fitness for"),
    ClauseType.governing_law: ("governing law", "jurisdiction", "governed by", "applicable law"),
}


class Clause(BaseModel):
    id: str
    type: ClauseType
    confidence: float
    text: str
    section: str | None = None


NUMBERED_CLAUSE_RE = re.compile(r"^\s*(\d+(?:\.\d+)*)\.\s+(.+)$", re.MULTILINE)


def _split_clauses(text: str) -> list[tuple[str, str]]:
    """Split contract text into (label, body) clauses via numbered headings."""
    matches = list(NUMBERED_CLAUSE_RE.finditer(text))
    spans: list[tuple[str, str]] = []
    for i, match in enumerate(matches):
        label = match.group(1)
        body = match.group(2)
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        spans.append((label, body + "\n" + text[start:end].strip()[:1000]))
    if not spans:
        spans.append(("1", text.strip()))
    return spans


def _score(text: str) -> tuple[ClauseType, float]:
    lowered = text.lower()
    best: ClauseType = ClauseType.unknown
    best_score = 0.0
    for ctype, kws in _KEYWORDS.items():
        hits = sum(1 for kw in kws if kw in lowered)
        score = hits / len(kws)
        if score > best_score:
            best_score = score
            best = ctype
    if best_score <= 0:
        return ClauseType.unknown, 0.0
    return best, min(best_score, 1.0)


class ClauseClassifier:
    def __init__(self, llm: LlmClient | None = None) -> None:
        self._llm = llm

    def classify(self, text: str) -> list[Clause]:
        clauses: list[Clause] = []
        for label, body in _split_clauses(text):
            ctype, conf = _score(body)
            clauses.append(
                Clause(
                    id=f"clause-{label}",
                    type=ctype,
                    confidence=conf,
                    text=body.strip(),
                    section=label,
                )
            )
        return clauses

    async def classify_llm(self, text: str) -> list[Clause]:
        if self._llm is None:
            return self.classify(text)
        prompt = (
            "Split the contract text into clauses. For each clause, "
            "classify it into one of: Payment, Confidentiality, Termination, "
            "Liability, Indemnity, Force Majeure, Intellectual Property, "
            "Arbitration, Warranty, Governing Law, Unknown. "
            "Return JSON: [{\"id\",\"type\",\"confidence\",\"text\",\"section\"}].\n\n"
            f"TEXT:\n{text[:3000]}"
        )
        data = await self._llm.structured(prompt)
        out: list[Clause] = []
        for item in data if isinstance(data, list) else data.get("clauses", []):
            out.append(Clause(**item))
        return out or self.classify(text)
