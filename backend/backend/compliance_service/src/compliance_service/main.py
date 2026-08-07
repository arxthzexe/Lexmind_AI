from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel

from compliance_service.engine import ComplianceCheck, ComplianceEngine

app = FastAPI(title="LexMind Compliance Service", version="1.0.0")
engine = ComplianceEngine()


class ComplianceResponse(BaseModel):
    checks: list[ComplianceCheck]


@app.post("/compliance", response_model=ComplianceResponse)
async def validate(text: str):
    return ComplianceResponse(checks=engine.validate(text))


@app.get("/health")
async def health():
    return {"status": "ok"}
