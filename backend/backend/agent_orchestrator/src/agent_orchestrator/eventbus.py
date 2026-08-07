from __future__ import annotations

import logging
from collections.abc import Awaitable, Callable
from enum import StrEnum
from typing import Any

logger = logging.getLogger("lexmind.events")


class WorkflowEvent(StrEnum):
    document_uploaded = "DocumentUploaded"
    ocr_completed = "OCRCompleted"
    layout_completed = "LayoutCompleted"
    clause_completed = "ClauseCompleted"
    ner_completed = "NERCompleted"
    graph_updated = "GraphUpdated"
    risk_completed = "RiskCompleted"
    compliance_completed = "ComplianceCompleted"
    report_generated = "ReportGenerated"
    audit_completed = "AuditCompleted"


Handler = Callable[[WorkflowEvent, dict[str, Any]], Awaitable[None]]


class EventBus:
    def __init__(self) -> None:
        self._handlers: dict[WorkflowEvent, list[Handler]] = {}
        self._log: list[dict[str, Any]] = []

    def subscribe(self, event: WorkflowEvent, handler: Handler) -> None:
        self._handlers.setdefault(event, []).append(handler)

    async def publish(self, event: WorkflowEvent, payload: dict[str, Any] | None = None) -> None:
        payload = payload or {}
        logger.info("event: %s", event.value)
        self._log.append({"event": event.value, "payload": payload})
        for handler in self._handlers.get(event, []):
            try:
                await handler(event, payload)
            except Exception as exc:
                logger.warning("event handler failed for %s: %s", event.value, exc)

    def history(self) -> list[dict[str, Any]]:
        return list(self._log)
