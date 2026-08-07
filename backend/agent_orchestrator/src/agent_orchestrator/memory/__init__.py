from __future__ import annotations

from typing import Any

from pydantic import BaseModel


class MemoryNamespace(BaseModel):
    semantic: dict[str, Any] = {}
    project: dict[str, Any] = {}
    organization: dict[str, Any] = {}
    agent: dict[str, Any] = {}


class SharedMemory:
    """In-process shared memory across agents (04 §Shared Memory)."""

    def __init__(self) -> None:
        self._store: dict[str, Any] = {}

    def set(self, key: str, value: Any) -> None:
        self._store[key] = value

    def get(self, key: str, default: Any = None) -> Any:
        return self._store.get(key, default)

    def update(self, key: str, patch: dict[str, Any]) -> None:
        existing = self._store.get(key, {})
        if isinstance(existing, dict):
            existing.update(patch)
            self._store[key] = existing

    def snapshot(self) -> dict[str, Any]:
        return dict(self._store)
