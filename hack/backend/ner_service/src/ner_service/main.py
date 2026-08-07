from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel

from ner_service.extractor import Entity, NerExtractor

app = FastAPI(title="LexMind NER Service", version="1.0.0")
extractor = NerExtractor()


class NerResponse(BaseModel):
    entities: list[Entity]


@app.post("/ner", response_model=NerResponse)
async def ner(text: str):
    return NerResponse(entities=extractor.extract(text))


@app.get("/health")
async def health():
    return {"status": "ok"}
