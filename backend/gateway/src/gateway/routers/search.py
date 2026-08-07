from fastapi import APIRouter, Depends, Query
from shared.auth import get_current_user

router = APIRouter(prefix="/search", tags=["search"])


@router.get("/")
async def search(
    q: str = Query(...),
    top_k: int = 10,
    user: dict = Depends(get_current_user),
):
    return {"query": q, "top_k": top_k, "results": []}
