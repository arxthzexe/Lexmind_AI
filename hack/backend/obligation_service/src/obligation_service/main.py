from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel

from obligation_service.extractor import Obligation, ObligationExtractor

app = FastAPI(title="LexMind Obligation Service", version="1.0.0")
extractor = ObligationExtractor()


class ObligationResponse(BaseModel):
    obligations: list[Obligation]


@app.post("/obligations", response_model=ObligationResponse)
async def extract(text: str):
    return ObligationResponse(obligations=extractor.extract(text))


@app.get("/health")
async def health():
    return {"status": "ok"}
