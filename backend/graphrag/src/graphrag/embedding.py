from __future__ import annotations

import logging
from typing import Any

import httpx
from shared.config import settings

logger = logging.getLogger("lexmind.embedding")


class EmbeddingClient:
    """BGE embedding client (self-hosted, sentence-transformers / TEI-style API)."""

    def __init__(self, *, base_url: str | None = None, dimension: int = 1024) -> None:
        self.base_url = (base_url or settings.embedding_url).rstrip("/")
        self.dimension = dimension
        self._client = httpx.AsyncClient(timeout=30.0)

    async def embed(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []
        if not self.base_url:
            raise RuntimeError("No embedding endpoint configured")
        try:
            resp = await self._client.post(
                f"{self.base_url}/embed",
                json={"texts": texts, "truncate": True},
            )
            resp.raise_for_status()
            data: dict[str, Any] = resp.json()
            embeddings = data.get("embeddings") or data.get("vectors") or []
            return [list(map(float, v)) for v in embeddings]
        except Exception as exc:
            logger.warning("embedding call failed: %s", exc)
            raise RuntimeError(f"Embedding service unavailable: {exc}") from exc

    async def embed_one(self, text: str) -> list[float]:
        embeddings = await self.embed([text])
        return embeddings[0] if embeddings else []

    async def aclose(self) -> None:
        await self._client.aclose()


_default: EmbeddingClient | None = None


def get_embedder() -> EmbeddingClient:
    global _default
    if _default is None:
        _default = EmbeddingClient()
    return _default
