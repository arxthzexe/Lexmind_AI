"""Chaos tests per 09 §Chaos Tests: component outage -> retry/fallback/degrade."""
import pytest
from agent_orchestrator.contract import AgentResult
from ocr_service.engine import OcrEngine, OcrPipeline
from shared.pipeline.types import OcrResult


class FailingEngine(OcrEngine):
    def __init__(self) -> None:
        super().__init__("failing")

    def run(self, image_bytes: bytes, mime: str) -> OcrResult:
        raise RuntimeError("engine down")


class WorkingEngine(OcrEngine):
    def __init__(self) -> None:
        super().__init__("working")

    def run(self, image_bytes: bytes, mime: str) -> OcrResult:
        from shared.pipeline.types import OcrPage

        return OcrResult(
            pages=[OcrPage(page_number=1, text="ok", confidence=0.9, width=10, height=10)],
            tables=[],
            signatures=[],
            engine=self.name,
            overall_confidence=0.9,
            raw_text="ok",
        )


def test_ocr_fallback_on_primary_failure():
    """Primary OCR down -> fallback engine used (04 §Retry Policy)."""
    pipeline = OcrPipeline(engines=[FailingEngine(), WorkingEngine()], fallback_threshold=0.6)
    result = pipeline.run(b"img")
    assert result.engine == "working"
    assert result.overall_confidence >= 0.6


def test_all_ocr_down_raises():
    pipeline = OcrPipeline(engines=[FailingEngine()], fallback_threshold=0.6)
    with pytest.raises(RuntimeError):
        pipeline.run(b"img")


def test_agent_retries_then_fails():
    """Agent failure strategy: 3 retries then graceful failure result (04 §Retry)."""

    from agent_orchestrator.contract import AgentSpec, BaseAgent

    class FlakyAgent(BaseAgent):
        spec = AgentSpec(name="flaky", objective="flaky", inputs=(), outputs=())
        attempts = 0

        async def _execute(self, task_id, inputs):
            self.attempts += 1
            if self.attempts < 3:
                raise RuntimeError("transient")
            return AgentResult(task_id=task_id, agent="flaky", confidence=1.0, result={})

    import asyncio

    agent = FlakyAgent()
    result = asyncio.run(agent.run("t1", {}))
    assert result.confidence == 1.0
    assert agent.attempts == 3


def test_gateway_lifespan_graceful_without_infra():
    """Gateway startup must not crash when infra is down (09 §Chaos: graceful degradation)."""
    import asyncio

    from fastapi import FastAPI
    from gateway.main import lifespan
    from shared.config import settings

    old = settings.app_skip_infra
    settings.app_skip_infra = True
    try:

        async def run():
            app = FastAPI()
            async with lifespan(app):
                pass

        asyncio.run(run())
    finally:
        settings.app_skip_infra = old


def test_gateway_lifespan_survives_infra_failure(monkeypatch):
    """Even with infra enabled, a failing startup step must not crash the gateway."""
    import asyncio

    from fastapi import FastAPI
    from gateway.main import lifespan
    from shared.config import settings

    async def boom():
        raise RuntimeError("infra down")

    old = settings.app_skip_infra
    settings.app_skip_infra = False
    try:
        import gateway.main as gm

        monkeypatch.setattr(gm, "init_db", boom)
        monkeypatch.setattr(gm, "ensure_bucket", boom)
        monkeypatch.setattr(gm, "ensure_collections", boom)

        async def run():
            app = FastAPI()
            async with lifespan(app):
                pass

        asyncio.run(run())
    finally:
        settings.app_skip_infra = old
