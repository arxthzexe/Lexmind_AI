from __future__ import annotations

from typing import Any

from qdrant_client import AsyncQdrantClient
from shared.config import settings
from shared.vector import collection_for

from graphrag.embedding import get_embedder
from graphrag.planner import QueryIntent


class HybridRetriever:
    """Step-1..6 hybrid retrieval: vector → graph → policy → regulation → rank."""

    def __init__(self, embedder=None, client: AsyncQdrantClient | None = None) -> None:
        self._embedder = embedder or get_embedder()
        self._client = client or AsyncQdrantClient(
            url=settings.qdrant_url, check_compatibility=False
        )

    async def vector_search(
        self,
        query: str,
        *,
        namespace: str = "clause",
        top_k: int = 5,
        filter_: Any = None,
    ) -> list[dict[str, Any]]:
        vector = await self._embedder.embed_one(query)
        collection = collection_for(namespace)  # type: ignore[arg-type]
        hits = await self._client.query_points(  # type: ignore[attr-defined]
            collection_name=collection,
            query=vector,
            limit=top_k,
            query_filter=filter_,
        )
        return [hit.payload for hit in hits.points if hit.payload]

    async def graph_expand(self, contract_id: str, seed: list[str]) -> list[str]:
        """Expand seed clause text via graph relationships (placeholder traversal)."""
        # Real implementation queries Neo4j; this returns seeds as-is for the
        # deterministic baseline.
        return seed

    async def retrieve(
        self,
        query: str,
        intent: QueryIntent,
        *,
        contract_id: str | None = None,
        top_k: int = 5,
    ) -> list[dict[str, Any]]:
        """Run the full hybrid pipeline and return ranked, deduplicated context."""
        clauses = await self.vector_search(query, namespace="clause", top_k=top_k)
        regulation_hits = await self.vector_search(query, namespace="regulation", top_k=2)
        policy_hits = await self.vector_search(query, namespace="policy", top_k=2)

        _expanded = await self.graph_expand(
            contract_id or "", [c.get("text", "") for c in clauses]
        )
        combined: dict[str, dict[str, Any]] = {}
        for item in clauses:
            key = item.get("id") or item.get("text", "")[:50]
            combined[key] = item
        for item in regulation_hits:
            key = f"reg:{item.get('id') or item.get('text', '')[:50]}"
            combined[key] = item
        for item in policy_hits:
            key = f"pol:{item.get('id') or item.get('text', '')[:50]}"
            combined[key] = item

        if intent in (QueryIntent.compliance, QueryIntent.risk):
            order = ["policy", "regulation", "clause"]
        elif intent == QueryIntent.timeline:
            order = ["clause", "regulation"]
        else:
            order = ["clause", "regulation", "policy"]

        def sort_key(item: tuple[Any, dict[str, Any]]) -> int:
            source = str(item[1].get("source", "clause"))
            return order.index(source) if source in order else len(order)

        ranked = sorted(combined.items(), key=sort_key)
        return [payload for _, payload in ranked[:top_k]]
