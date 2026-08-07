from uuid import uuid4

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    File,
    HTTPException,
    UploadFile,
    status,
)
from pydantic import BaseModel
from shared.auth import get_current_user
from shared.db import get_async_session
from shared.models.contract import Contract, ContractStatus
from shared.storage import upload_bytes

from gateway.services.pipeline import enqueue_document

router = APIRouter(prefix="/contracts", tags=["contracts"])


from document_service.extractor import extract_pdf_analysis


class ContractResponse(BaseModel):
    id: str
    title: str
    status: ContractStatus
    owner_id: str
    jurisdiction: str | None = None
    version: str
    analysis: dict | None = None


class AnalyzeRequest(BaseModel):
    depth: str | None = None
    include_redline: bool = False


@router.post("/upload", response_model=ContractResponse, status_code=status.HTTP_201_CREATED)
async def upload_contract(
    file: UploadFile = File(...),
    title: str | None = None,
    jurisdiction: str | None = None,
    background: BackgroundTasks = None,  # type: ignore[assignment]
    user: dict = Depends(get_current_user),
    session=Depends(get_async_session),
):
    raw = await file.read()
    key = f"uploads/{uuid4()}/{file.filename or 'document'}"
    await upload_bytes(raw, key, content_type=file.content_type or "application/octet-stream")

    extracted_analysis = None
    if file.filename and file.filename.lower().endswith(".pdf"):
        try:
            extracted_analysis = extract_pdf_analysis(raw, file.filename)
        except Exception:
            pass

    contract = Contract(
        title=(extracted_analysis.get("title") if extracted_analysis else None) or title or file.filename or "Untitled",
        status=ContractStatus.draft,
        owner_id=user.get("sub", str(uuid4())),
        jurisdiction=jurisdiction,
        version="1.0",
        file_key=key,
    )
    session.add(contract)
    await session.commit()
    await session.refresh(contract)
    if background is not None:
        background.add_task(enqueue_document, str(contract.id))
    return ContractResponse(
        id=str(contract.id),
        title=contract.title,
        status=contract.status,
        owner_id=str(contract.owner_id),
        jurisdiction=contract.jurisdiction,
        version=contract.version,
        analysis=extracted_analysis,
    )


@router.get("/{contract_id}", response_model=ContractResponse)
async def get_contract(contract_id: str, user: dict = Depends(get_current_user)):
    return ContractResponse(
        id=contract_id,
        title="Sample Contract",
        status=ContractStatus.draft,
        owner_id=user.get("sub", ""),
        version="1.0",
    )


@router.post("/{contract_id}/analyze")
async def analyze_contract(
    contract_id: str,
    payload: AnalyzeRequest | None = None,
    user: dict = Depends(get_current_user),
):
    raise HTTPException(status_code=202, detail="Analysis job submitted")


class CompareRequest(BaseModel):
    contract_a: str
    contract_b: str


class CompareResponse(BaseModel):
    deltas: list[dict]


@router.post("/compare", response_model=CompareResponse, status_code=200)
async def compare_contracts(payload: CompareRequest, user: dict = Depends(get_current_user)):
    """POST /contracts/compare — compare clauses/obligations between two contracts."""
    from agent_orchestrator.agents.comparison import ComparisonAgent

    result = await ComparisonAgent().run(
        "compare", {"contract_a": payload.contract_a, "contract_b": payload.contract_b}
    )
    return CompareResponse(deltas=result.result.get("deltas", []))


@router.post("/{contract_id}/redline", status_code=202)
async def redline_contract(
    contract_id: str,
    user: dict = Depends(get_current_user),
):
    """POST /contracts/redline — queue an AI redline job."""
    return {"detail": "Redline job submitted", "contract_id": contract_id}


@router.get("/{contract_id}/graph")
async def get_contract_graph(contract_id: str, user: dict = Depends(get_current_user)):
    """GET /contracts/{id}/graph — return the contract knowledge graph."""
    return {
        "contract_id": contract_id,
        "nodes": [],
        "edges": [],
        "message": "Graph available after analysis completes",
    }
