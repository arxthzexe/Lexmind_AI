from __future__ import annotations

from enum import StrEnum


class QueryIntent(StrEnum):
    search = "Search"
    compliance = "Compliance"
    risk = "Risk"
    negotiation = "Negotiation"
    comparison = "Comparison"
    timeline = "Timeline"


_INTENT_KEYWORDS: dict[QueryIntent, tuple[str, ...]] = {
    QueryIntent.compliance: (
        "comply",
        "compliance",
        "regulation",
        "policy",
        "required",
        "must comply",
    ),
    QueryIntent.risk: ("risk", "liability", "exposure", "danger", "severity", "indemnification"),
    QueryIntent.negotiation: (
        "negotiate",
        "alternative",
        "redline",
        "suggest",
        "better wording",
        "change",
    ),
    QueryIntent.comparison: ("compare", "difference", "versus", "vs", "version"),
    QueryIntent.timeline: (
        "deadline",
        "when",
        "due",
        "expiry",
        "renewal",
        "notice period",
        "effective date",
    ),
    QueryIntent.search: ("find", "search", "where", "clause about", "what does"),
}


class QueryPlanner:
    def plan(self, query: str) -> QueryIntent:
        lowered = query.lower()
        best: QueryIntent = QueryIntent.search
        best_hits = 0
        for intent, keywords in _INTENT_KEYWORDS.items():
            hits = sum(1 for kw in keywords if kw in lowered)
            if hits > best_hits:
                best_hits = hits
                best = intent
        return best
