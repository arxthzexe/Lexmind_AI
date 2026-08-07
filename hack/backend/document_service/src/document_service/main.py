from __future__ import annotations

from fastapi import FastAPI, File, HTTPException, UploadFile, status

from document_service.validator import FileValidator

app = FastAPI(title="LexMind Document Service", version="1.0.0")
validator = FileValidator()


@app.post("/validate")
async def validate(file: UploadFile = File(...)):
    raw = await file.read()
    result = validator.validate(raw, file.filename or "")
    if not result.valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result.error)
    return {
        "valid": True,
        "mime": result.mime,
        "sha256": result.sha256,
        "filename": file.filename,
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
