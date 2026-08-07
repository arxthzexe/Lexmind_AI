from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any, Protocol

from pydantic import BaseModel

logger = logging.getLogger("lexmind.agent")


class AgentResult(BaseModel):
    """Structured agent output (04 §Agent Communication)."""

    task_id: str
    agent: str
    status: str = "success"
    confidence: float = 0.0
    evidence: list[str] = field(default_factory=list)  # type: ignore[assignment]
    result: dict[str, Any] = field(default_factory=dict)  # type: ignore[assignment]


class Agent(Protocol):
    name: str
    objective: str

    async def run(self, task_id: str, inputs: dict[str, Any]) -> AgentResult: ...


@dataclass
class AgentSpec:
    """Common agent contract (03 §Common Agent Contract)."""

    name: str
    objective: str
    inputs: tuple[str, ...]
    outputs: tuple[str, ...]
    tools: tuple[str, ...] = ()
    memory: tuple[str, ...] = ()
    failure_strategy: str = "retry:3;fallback;escalate"
    default_confidence: float = 0.5


class BaseAgent:
    """Base implementation providing retry (3 attempts) + logging per 04."""

    spec: AgentSpec
    max_attempts: int = 3

    @property
    def name(self) -> str:
        return self.spec.name

    async def run(self, task_id: str, inputs: dict[str, Any]) -> AgentResult:
        last_exc: Exception | None = None
        for attempt in range(1, self.max_attempts + 1):
            try:
                logger.info("agent %s attempt %d", self.name, attempt)
                return await self._execute(task_id, inputs)
            except Exception as exc:
                last_exc = exc
                logger.warning("agent %s attempt %d failed: %s", self.name, attempt, exc)
        return AgentResult(
            task_id=task_id,
            agent=self.name,
            status="failed",
            confidence=0.0,
            evidence=[],
            result={"error": str(last_exc)},
        )

    async def _execute(self, task_id: str, inputs: dict[str, Any]) -> AgentResult:
        raise NotImplementedError
