from __future__ import annotations

from typing import Any

from shared.llm import LlmClient

from graphrag.planner import QueryIntent
from graphrag.retrieval import HybridRetriever


class ExplainabilityRecord:
    """Every answer carries an evidence trail (06 §Explainability)."""

    def __init__(
        self,
        *,
        clause_refs: list[str] | None = None,
        graph_path: list[str] | None = None,
        regulations: list[str] | None = None,
        similar_contracts: list[str] | None = None,
        confidence: float = 0.0,
        evidence: list[str] | None = None,
    ) -> None:
        self.clause_refs = clause_refs or []
        self.graph_path = graph_path or []
        self.regulations = regulations or []
        self.similar_contracts = similar_contracts or []
        self.confidence = confidence
        self.evidence = evidence or []

    def to_dict(self) -> dict[str, Any]:
        return {
            "clause_refs": self.clause_refs,
            "graph_path": self.graph_path,
            "regulations": self.regulations,
            "similar_contracts": self.similar_contracts,
            "confidence": self.confidence,
            "evidence": self.evidence,
        }


class ContextBuilder:
    def __init__(
        self,
        retriever: HybridRetriever | None = None,
        llm: LlmClient | None = None,
    ) -> None:
        self._retriever = retriever or HybridRetriever()
        self._llm = llm

    async def build(self, query: str, intent: QueryIntent) -> tuple[str, ExplainabilityRecord]:
        chunks = await self._retriever.retrieve(query, intent)
        context_parts: list[str] = []
        evidence: list[str] = []
        clause_refs: list[str] = []
        for chunk in chunks:
            text = chunk.get("text") or chunk.get("content") or ""
            if not text:
                continue
            context_parts.append(text)
            source = chunk.get("source") or chunk.get("document_type") or "clause"
            evidence.append(f"{source}: {text[:200]}")
            if source == "clause":
                ref = chunk.get("id") or chunk.get("clause_id")
                if ref:
                    clause_refs.append(str(ref))
        context = "\n\n".join(context_parts)
        return context, ExplainabilityRecord(
            clause_refs=clause_refs,
            evidence=evidence,
            confidence=0.9 if chunks else 0.0,
        )

    async def answer(self, query: str, intent: QueryIntent) -> dict[str, Any]:
        context, record = await self.build(query, intent)
        answer_text: str
        if self._llm is not None and context:
            answer_text = await self._llm.complete(
                f"Answer the question using only the provided context.\n\n"
                f"CONTEXT:\n{context}\n\nQUESTION: {query}"
            )
        else:
            answer_text = (
                "Grounded in retrieved clauses. See evidence for details."
                if context
                else "No relevant context found."
            )
        return {
            "answer": answer_text,
            "intent": intent.value,
            "explainability": record.to_dict(),
        }
