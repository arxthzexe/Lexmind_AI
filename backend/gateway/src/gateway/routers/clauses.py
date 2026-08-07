from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/clauses", tags=["clauses"])


class ClauseExtractRequest(BaseModel):
    text: str


@router.post("/extract")
async def extract_clauses(payload: ClauseExtractRequest):
    return {
        "clauses": [
            {"id": "cl-1", "title": "Confidentiality", "type": "Confidentiality", "text": "Receiving party agrees to maintain strict confidentiality for 5 years.", "confidence": 0.98},
            {"id": "cl-2", "title": "Payment Terms", "type": "Payment", "text": "Invoices payable within net 30 days from invoice date.", "confidence": 0.95},
            {"id": "cl-3", "title": "Indemnification", "type": "Indemnity", "text": "Vendor agrees to defend and indemnify client from third party claims.", "confidence": 0.92},
        ]
    }
