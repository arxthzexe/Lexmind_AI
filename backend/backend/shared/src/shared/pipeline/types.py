from __future__ import annotations

from enum import StrEnum
from typing import Any

from pydantic import BaseModel, Field


class DocumentType(StrEnum):
    nda = "nda"
    service = "service_agreement"
    supply = "supply_agreement"
    employment = "employment"
    lease = "lease"
    other = "other"


class BBox(BaseModel):
    x0: float = 0.0
    top: float = 0.0
    x1: float = 0.0
    bottom: float = 0.0
    page: int = 1


class OcrPage(BaseModel):
    page_number: int
    text: str
    confidence: float
    width: int
    height: int
    blocks: list[dict[str, Any]] = Field(default_factory=list)


class OcrResult(BaseModel):
    pages: list[OcrPage]
    tables: list[dict[str, Any]] = Field(default_factory=list)
    signatures: list[dict[str, Any]] = Field(default_factory=list)
    engine: str
    overall_confidence: float
    raw_text: str = ""


class LayoutNode(BaseModel):
    text: str = ""
    node_type: str
    confidence: float = 0.0
    bbox: BBox | None = None
    page: int = 1
    children: list[LayoutNode] = Field(default_factory=list)

    def add(self, child: LayoutNode) -> LayoutNode:
        self.children.append(child)
        return self


class LayoutTree(BaseModel):
    pages: list[LayoutNode]
    reading_order: list[str] = Field(default_factory=list)
