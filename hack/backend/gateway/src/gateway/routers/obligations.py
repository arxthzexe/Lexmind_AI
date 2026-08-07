from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/obligations", tags=["obligations"])


class ObligationExtractRequest(BaseModel):
    text: str


@router.post("/extract")
async def extract_obligations(payload: ObligationExtractRequest):
    return {
        "obligations": [
            {"id": "obl-1", "actor": "Client", "action": "Remit quarterly regulatory tariff fee", "dueDate": "2025-12-31", "status": "pending", "penalty": "LPS late payment surcharge"},
            {"id": "obl-2", "actor": "Contractor", "action": "File annual compliance audit report", "dueDate": "2025-06-30", "status": "pending", "penalty": "Standard regulatory fine"},
        ]
    }
