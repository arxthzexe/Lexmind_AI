from __future__ import annotations

from fastapi import FastAPI, File, HTTPException, UploadFile, status
from pydantic import BaseModel

from ocr_service.engine import OcrPipeline

app = FastAPI(title="LexMind OCR Service", version="1.0.0")
pipeline = OcrPipeline.default()


class OcrResponse(BaseModel):
    engine: str
    overall_confidence: float
    pages: list[dict]
    tables: list[dict]
    signatures: list[dict]
    raw_text: str


@app.post("/ocr", response_model=OcrResponse)
async def ocr_endpoint(file: UploadFile = File(...)):
    raw = await file.read()
    if not raw:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty file")
    result = pipeline.run(raw, file.content_type or "image/png")
    return OcrResponse(
        engine=result.engine,
        overall_confidence=result.overall_confidence,
        pages=[p.model_dump() for p in result.pages],
        tables=result.tables,
        signatures=result.signatures,
        raw_text=result.raw_text,
    )


@app.get("/health")
async def health():
    return {"status": "ok", "engines": [e.name for e in pipeline.engines]}
