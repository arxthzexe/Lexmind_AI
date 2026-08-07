from __future__ import annotations

from typing import Literal, cast

from qdrant_client import AsyncQdrantClient
from qdrant_client.http import models as rest  # type: ignore

from shared.config import settings

_COLLECTIONS: dict[str, str] = {
    "clause": "clause-embeddings",
    "regulation": "regulation-embeddings",
    "policy": "policy-embeddings",
    "history": "historical-contracts",
    "summary": "executive-summaries",
    "template": "negotiation-templates",
}

_Namespace = Literal[
    "clause", "regulation", "policy", "history", "summary", "template"
]


def collection_for(namespace: _Namespace) -> str:
    return _COLLECTIONS[namespace]


def get_qdrant_client() -> AsyncQdrantClient:
    return AsyncQdrantClient(url=settings.qdrant_url, check_compatibility=False)


async def ensure_collections(embedding_dim: int = 1024) -> None:
    client = get_qdrant_client()
    existing = {c.name for c in (await client.get_collections()).collections}
    vectors_config = cast(dict, {"default": {"size": embedding_dim, "distance": "COSINE"}})
    for name in _COLLECTIONS.values():
        if name not in existing:
            await client.recreate_collection(collection_name=name, vectors_config=vectors_config)
        await client.create_payload_index(name, "contract_id", keyword=True)
        await client.create_payload_index(name, "document_type", keyword=True)


rest.VectorParams  # noqa: B018 — re-export guard
