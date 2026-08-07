from fastapi import APIRouter, Depends
from shared.auth import get_current_user

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/{report_id}")
async def get_report(report_id: str, user: dict = Depends(get_current_user)):
    return {
        "report_id": report_id,
        "summary": {"executive": "", "legal": "", "risk": ""},
        "recommendations": [],
        "confidence": 0.0,
    }


@router.get("/")
async def list_reports(user: dict = Depends(get_current_user)):
    return {"reports": []}
