from __future__ import annotations

import logging
from dataclasses import dataclass, field

from PIL import Image
from shared.pipeline.types import OcrPage, OcrResult

logger = logging.getLogger("lexmind.ocr")


@dataclass
class OcrEngine:
    name: str

    def run(self, image_bytes: bytes, mime: str) -> OcrResult:
        raise NotImplementedError


def _page_from_image(img: Image.Image, page_number: int) -> dict:
    # placeholder: real OCR populates text via tesseract/paddle/docling
    return {
        "page_number": page_number,
        "text": "",
        "confidence": 0.0,
        "width": img.width,
        "height": img.height,
        "blocks": [],
    }


class DoclingEngine(OcrEngine):
    def __init__(self) -> None:
        super().__init__("docling")
        try:
            from docling.document_converter import DocumentConverter  # type: ignore

            self._converter = DocumentConverter()
        except Exception as exc:
            logger.warning("docling unavailable: %s", exc)
            self._converter = None

    def run(self, image_bytes: bytes, mime: str) -> OcrResult:
        if self._converter is None:
            raise RuntimeError("docling not initialized")
        # Docling handles bytes via source
        from io import BytesIO

        from docling.core.format.reader import BytesDocumentReader  # type: ignore

        reader = BytesDocumentReader(file_stream=BytesIO(image_bytes), file_type=mime)
        doc = self._converter.convert(input=reader)
        pages: list[OcrPage] = []
        tables: list[dict] = []
        total_conf = 0.0
        raw_parts: list[str] = []
        for i, page in enumerate(doc.pages or [], start=1):
            text = getattr(page, "text", "") or ""
            conf = getattr(page, "confidence", 0.0) or 0.0
            raw_parts.append(text)
            pages.append(
                OcrPage(
                    page_number=i,
                    text=text,
                    confidence=float(conf),
                    width=getattr(page, "width", 0),
                    height=getattr(page, "height", 0),
                    blocks=[],
                )
            )
            total_conf += float(conf)
        avg = total_conf / len(pages) if pages else 0.0
        for _tbl in doc.tables or []:
            tables.append({"bbox": {}, "data": []})
        return OcrResult(
            pages=pages,
            tables=tables,
            signatures=[],
            engine=self.name,
            overall_confidence=avg,
            raw_text="\n".join(raw_parts),
        )


class PaddleOcrEngine(OcrEngine):
    def __init__(self) -> None:
        super().__init__("paddleocr")
        try:
            from paddleocr import PaddleOCR  # type: ignore

            self._ocr = PaddleOCR(
                use_angle_cls=False,
                lang="en",
                show_log=False,
                use_gpu=False,
            )
        except Exception as exc:
            logger.warning("paddleocr unavailable: %s", exc)
            self._ocr = None

    def run(self, image_bytes: bytes, mime: str) -> OcrResult:
        if self._ocr is None:
            raise RuntimeError("paddleocr not initialized")
        from io import BytesIO

        import numpy as np
        from PIL import Image

        img = Image.open(BytesIO(image_bytes)).convert("RGB")
        result = self._ocr.ocr(np.array(img), cls=False)
        pages: list[OcrPage] = []
        lines: list[str] = []
        confs: list[float] = []
        for line in result[0] or []:
            text = line[1][0]
            conf = float(line[1][1])
            lines.append(text)
            confs.append(conf)
        conf_avg = sum(confs) / len(confs) if confs else 0.0
        pages.append(
            OcrPage(
                page_number=1,
                text="\n".join(lines),
                confidence=conf_avg,
                width=img.width,
                height=img.height,
                blocks=[],
            )
        )
        return OcrResult(
            pages=pages,
            tables=[],
            signatures=[],
            engine=self.name,
            overall_confidence=conf_avg,
            raw_text="\n".join(lines),
        )


class EasyOcrEngine(OcrEngine):
    def __init__(self) -> None:
        super().__init__("easyocr")
        try:
            import easyocr  # type: ignore

            self._reader = easyocr.Reader(["en"], gpu=False)
        except Exception as exc:
            logger.warning("easyocr unavailable: %s", exc)
            self._reader = None

    def run(self, image_bytes: bytes, mime: str) -> OcrResult:
        if self._reader is None:
            raise RuntimeError("easyocr not initialized")
        from io import BytesIO

        from PIL import Image

        img = Image.open(BytesIO(image_bytes)).convert("RGB")
        import numpy as np
        results = self._reader.readtext(np.array(img))
        lines = [r[1] for r in results]
        confs = [float(r[2]) for r in results]
        conf_avg = sum(confs) / len(confs) if confs else 0.0
        pages: list[OcrPage] = [
            OcrPage(
                page_number=1,
                text="\n".join(lines),
                confidence=conf_avg,
                width=img.width,
                height=img.height,
                blocks=[],
            )
        ]
        return OcrResult(
            pages=pages,
            tables=[],
            signatures=[],
            engine=self.name,
            overall_confidence=conf_avg,
            raw_text="\n".join(lines),
        )


@dataclass
class OcrPipeline:
    engines: list[OcrEngine] = field(default_factory=list)
    fallback_threshold: float = 0.6

    @classmethod
    def default(cls) -> OcrPipeline:
        return cls(engines=[DoclingEngine(), PaddleOcrEngine(), EasyOcrEngine()])

    def run(self, image_bytes: bytes, mime: str = "image/png") -> OcrResult:
        best: OcrResult | None = None
        for engine in self.engines:
            try:
                result = engine.run(image_bytes, mime)
            except Exception as exc:
                logger.warning("engine %s failed: %s", engine.name, exc)
                continue
            if best is None or result.overall_confidence > best.overall_confidence:
                best = result
            if result.overall_confidence >= self.fallback_threshold:
                return result
        if best is None:
            raise RuntimeError("All OCR engines failed")
        return best
