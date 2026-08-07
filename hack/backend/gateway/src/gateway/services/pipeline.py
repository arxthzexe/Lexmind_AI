from __future__ import annotations

import structlog

logger = structlog.get_logger(__name__)


async def enqueue_document(contract_id: str) -> None:
    """Enqueue a contract for the Document AI pipeline.

    Phase 2 implements the real enqueue (Celery/RQ/Kafka producer). For now
    this logs and returns, keeping the gateway functional for integration tests.
    """
    logger.info("document enqueued for processing", contract_id=contract_id)
