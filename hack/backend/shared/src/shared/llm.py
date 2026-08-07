from __future__ import annotations

import logging
from typing import Any

import httpx

from shared.config import settings

logger = logging.getLogger("lexmind.llm")


class LlmClient:
    """HTTP client for a self-hosted vLLM-compatible LLM endpoint.

    Uses a simple chat-style prompt. Methods raise RuntimeError when the model
    endpoint is unavailable so callers can degrade gracefully (04 retry policy).
    """

    def __init__(self, *, base_url: str | None = None, model: str | None = None) -> None:
        self.base_url = (base_url or settings.vllm_url).rstrip("/")
        self.model = model or settings.llm_model
        self._client = httpx.AsyncClient(timeout=60.0)

    async def complete(
        self, prompt: str, *, max_tokens: int = 512, temperature: float = 0.0
    ) -> str:
        if not self.base_url:
            raise RuntimeError("No LLM endpoint configured")
        try:
            resp = await self._client.post(
                f"{self.base_url}/chat/completions",
                json={
                    "model": self.model,
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": max_tokens,
                    "temperature": temperature,
                },
            )
            resp.raise_for_status()
            data: dict[str, Any] = resp.json()
            content = data["choices"][0]["message"]["content"]
            return str(content)
        except Exception as exc:
            logger.warning("LLM call failed: %s", exc)
            raise RuntimeError(f"LLM unavailable: {exc}") from exc

    async def structured(self, prompt: str) -> dict[str, Any]:
        """Best-effort JSON extraction; returns {} when the LLM is unavailable."""
        from shared.pipeline.jsonutil import extract_json

        try:
            text = await self.complete(prompt, max_tokens=1024, temperature=0.0)
        except RuntimeError:
            return {}
        return extract_json(text)

    async def aclose(self) -> None:
        await self._client.aclose()


_default: LlmClient | None = None


def get_llm() -> LlmClient:
    global _default
    if _default is None:
        _default = LlmClient()
    return _default
