from __future__ import annotations

from fastapi import FastAPI, File, HTTPException, UploadFile, status
from pydantic import BaseModel

from layout_service.engine import default_detector

app = FastAPI(title="LexMind Layout Service", version="1.0.0")
detect = default_detector()


class LayoutResponse(BaseModel):
    nodes: list[dict]


@app.post("/layout", response_model=LayoutResponse)
async def layout_endpoint(file: UploadFile = File(...)):
    raw = await file.read()
    if not raw:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Empty file")
    text = raw.decode("utf-8", errors="ignore")
    tree = detect(text)
    return LayoutResponse(nodes=[n.model_dump() for n in tree.pages])


@app.get("/health")
async def health():
    return {"status": "ok", "engine": "rule-based-baseline"}
