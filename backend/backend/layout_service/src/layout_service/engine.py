from __future__ import annotations

import re
from collections.abc import Callable
from dataclasses import dataclass

from PIL import Image
from shared.pipeline.types import LayoutNode, LayoutTree


@dataclass
class LayoutEngine:
    """Rule-based layout analysis baseline.

    Detects titles, headings, clauses (numbered sections), tables, and signatures
    from OCR-extracted text. This is the deterministic baseline; a vision model
    (e.g. InternViT/Heron per 05 §Layout Analysis) can be swapped in via the
    Detector protocol when available.
    """

    title_re = re.compile(r"^(.*?)$")
    heading_re = re.compile(r"^(?:articl|sec|section|s\s*\/|chapter|clause)\s+\S+", re.IGNORECASE)
    numbered_re = re.compile(r"^\d+(?:\.\d+)*[.)]?\s+([A-Z0-9])")
    table_re = re.compile(r"(\n\s*\n)+", re.DOTALL)
    signature_re = re.compile(r"(signature|signed|by:|________________)", re.IGNORECASE)

    def analyze(self, text: str, image: Image.Image | None = None) -> LayoutTree:
        pages: list[LayoutNode] = [LayoutNode(text="page-1", node_type="page")]
        current_section: LayoutNode | None = None
        lines = text.splitlines()
        for line in lines:
            stripped = line.strip()
            if not stripped:
                continue
            if self.signature_re.search(stripped):
                pages[-1].add(LayoutNode(text=stripped, node_type="signature", page=1))
            elif self.numbered_re.match(stripped):
                clause = LayoutNode(text=stripped, node_type="clause", page=1)
                pages[-1].add(clause)
                current_section = clause
            elif self.heading_re.search(stripped):
                node = LayoutNode(text=stripped, node_type="heading", page=1)
                pages[-1].add(node)
            else:
                para = LayoutNode(text=stripped, node_type="paragraph", page=1)
                target = current_section or pages[-1]
                target.add(para)
        return LayoutTree(pages=pages)


Detector = Callable[[str], LayoutTree]


def default_detector() -> Detector:
    engine = LayoutEngine()

    def detect(text: str) -> LayoutTree:
        return engine.analyze(text)

    return detect
