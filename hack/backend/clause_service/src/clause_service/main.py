from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel

from clause_service.classifier import Clause, ClauseClassifier, ClauseType

app = FastAPI(title="LexMind Clause Service", version="1.0.0")
classifier = ClauseClassifier()


class ClassifyResponse(BaseModel):
    clauses: list[Clause]


@app.post("/clauses", response_model=ClassifyResponse)
async def classify(text: str):
    return ClassifyResponse(clauses=classifier.classify(text))


@app.get("/health")
async def health():
    return {"status": "ok", "clause_types": [c.value for c in ClauseType]}
