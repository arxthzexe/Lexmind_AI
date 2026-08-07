from __future__ import annotations

import re
from enum import StrEnum

from pydantic import BaseModel
from shared.llm import LlmClient


class EntityType(StrEnum):
    party = "PARTY"
    org = "ORGANIZATION"
    date = "DATE"
    money = "MONEY"
    jurisdiction = "JURISDICTION"
    law = "LAW"
    contract_id = "CONTRACT_ID"
    address = "ADDRESS"


class Entity(BaseModel):
    text: str
    type: EntityType
    confidence: float
    span: tuple[int, int] | None = None


# Deterministic regex baselines
_PARTY_RE = re.compile(
    r"(Party\s+[A-Z]|The\s+\w+\s+Corporation|\w+[\s&]\w+|Acme(?:\s+\w+)*|Supplier|Customer)\b",
    re.I,
)
_DATE_RE = re.compile(
    r"\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4})\b",
    re.I,
)
_MONEY_RE = re.compile(r"\$(?:\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d+(?:\.\d{2})?)\b")
_JURISDICTION_RE = re.compile(
    r"\b(New York|Delaware|England and Wales|EU|United States|California)\b", re.I
)
_LAW_RE = re.compile(
    r"\b(GDPR|CCPA|Sarbanes-Oxley|SOX|UK Bribery Act|HIPAA|FDA)\b", re.I
)
_CONTRACT_ID_RE = re.compile(r"\b([A-Z]{2,}-\d{4}-[A-Z0-9]+)\b")
_ADDRESS_RE = re.compile(
    r"\b\d+\s+[\w\s]+(?:Street|St|Avenue|Ave|Rd|Road|Boulevard|Blvd),?\s+[\w\s]+,\s*[A-Z]{2}\s+\d{5}\b"
)


class NerExtractor:
    def __init__(self, llm: LlmClient | None = None) -> None:
        self._llm = llm

    def extract(self, text: str) -> list[Entity]:
        entities: list[Entity] = []
        seen: set[tuple[str, EntityType]] = set()

        for m in _PARTY_RE.finditer(text):
            key = (m.group(0), EntityType.party)
            if key not in seen:
                seen.add(key)
                self._add(entities, m.group(0), EntityType.party, 0.7, m.span())
        for m in _DATE_RE.finditer(text):
            self._add(entities, m.group(1), EntityType.date, 0.85, m.span())
        for m in _MONEY_RE.finditer(text):
            self._add(entities, m.group(0), EntityType.money, 0.9, m.span())
        for m in _JURISDICTION_RE.finditer(text):
            self._add(entities, m.group(0), EntityType.jurisdiction, 0.8, m.span())
        for m in _LAW_RE.finditer(text):
            self._add(entities, m.group(0), EntityType.law, 0.9, m.span())
        for m in _CONTRACT_ID_RE.finditer(text):
            self._add(entities, m.group(0), EntityType.contract_id, 0.85, m.span())
        for m in _ADDRESS_RE.finditer(text):
            self._add(entities, m.group(0), EntityType.address, 0.75, m.span())
        return entities

    @staticmethod
    def _add(
        entities: list[Entity],
        text: str,
        etype: EntityType,
        conf: float,
        span: tuple[int, int],
    ) -> None:
        entities.append(Entity(text=text, type=etype, confidence=conf, span=span))

    async def extract_llm(self, text: str) -> list[Entity]:
        if self._llm is None:
            return self.extract(text)
        prompt = (
            "Extract entities from the contract text. For each entity return "
            "JSON: [{\"text\",\"type\",\"confidence\"}] where type is one of "
            "PARTY, ORGANIZATION, DATE, MONEY, JURISDICTION, LAW, CONTRACT_ID, ADDRESS.\n\n"
            f"TEXT:\n{text[:3000]}"
        )
        data = await self._llm.structured(prompt)
        out: list[Entity] = []
        items = data if isinstance(data, list) else data.get("entities", [])
        for item in items:
            out.append(Entity(**item))
        return out or self.extract(text)
