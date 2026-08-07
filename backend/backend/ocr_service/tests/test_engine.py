from __future__ import annotations

from ocr_service.engine import OcrEngine, OcrPipeline
from shared.pipeline.types import OcrResult


class FakeEngine(OcrEngine):
    def __init__(self, conf: float) -> None:
        super().__init__("fake")
        self._conf = conf

    def run(self, image_bytes: bytes, mime: str) -> OcrResult:
        from shared.pipeline.types import OcrPage

        page = OcrPage(
            page_number=1,
            text="Sample contract text",
            confidence=self._conf,
            width=100,
            height=100,
            blocks=[],
        )
        return OcrResult(
            pages=[page],
            tables=[],
            signatures=[],
            engine=self.name,
            overall_confidence=self._conf,
            raw_text="Sample contract text",
        )


def test_pipeline_uses_highest_confidence():
    engines = [FakeEngine(0.5), FakeEngine(0.9), FakeEngine(0.3)]
    pipeline = OcrPipeline(engines=engines, fallback_threshold=0.95)
    result = pipeline.run(b"img", "image/png")
    assert result.overall_confidence == 0.9
    assert result.engine == "fake"


def test_pipeline_falls_back_below_threshold():
    pipeline = OcrPipeline(engines=[FakeEngine(0.5), FakeEngine(0.6)], fallback_threshold=0.9)
    result = pipeline.run(b"img", "image/png")
    assert result.overall_confidence == 0.6


def test_pipeline_all_fail_raises():
    class Failing(FakeEngine):
        def run(self, image_bytes: bytes, mime: str) -> OcrResult:
            raise RuntimeError("down")

    pipeline = OcrPipeline(engines=[Failing(0.0)], fallback_threshold=0.6)
    try:
        pipeline.run(b"img", "image/png")
    except RuntimeError:
        assert True
    else:
        raise AssertionError("expected RuntimeError")
