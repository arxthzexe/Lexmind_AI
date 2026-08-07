from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel

from risk_service.assessor import Risk, RiskAssessor

app = FastAPI(title="LexMind Risk Service", version="1.0.0")
assessor = RiskAssessor()


class RiskResponse(BaseModel):
    risks: list[Risk]


@app.post("/risks", response_model=RiskResponse)
async def assess(text: str):
    return RiskResponse(risks=assessor.assess(text))


@app.get("/health")
async def health():
    return {"status": "ok"}
