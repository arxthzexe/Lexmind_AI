from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/risks", tags=["risks"])


class RiskAssessRequest(BaseModel):
    text: str


@router.post("/assess")
async def assess_risks(payload: RiskAssessRequest):
    return {
        "risk_level": "Medium",
        "score": 74,
        "risks": [
            {"id": "rsk-1", "title": "Uncapped Liability Exposure", "severity": "High", "description": "Liability clause lacks standard monetary cap."},
            {"id": "rsk-2", "title": "Short Termination Window", "severity": "Medium", "description": "30-day notice period may delay vendor transition."},
        ]
    }
