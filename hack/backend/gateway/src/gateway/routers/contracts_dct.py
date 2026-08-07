from fastapi import APIRouter, Depends
from pydantic import BaseModel
from shared.auth import get_current_user

router = APIRouter(prefix="/contracts", tags=["digital-contract-twin"])


class EventPayload(BaseModel):
    event_type: str
    actor: str | None = None
    details: dict | None = None


class SimulatePayload(BaseModel):
    scenario: str
    params: dict | None = None


@router.get("/{contract_id}/twin")
async def get_twin(contract_id: str, user: dict = Depends(get_current_user)):
    return {"contract_id": contract_id, "twin": {}}


@router.get("/{contract_id}/timeline")
async def get_timeline(contract_id: str, user: dict = Depends(get_current_user)):
    return {"contract_id": contract_id, "timeline": []}


@router.get("/{contract_id}/obligations")
async def get_obligations(contract_id: str, user: dict = Depends(get_current_user)):
    return {"contract_id": contract_id, "obligations": []}


@router.get("/{contract_id}/risk-history")
async def get_risk_history(contract_id: str, user: dict = Depends(get_current_user)):
    return {"contract_id": contract_id, "risk_history": []}


@router.post("/{contract_id}/events", status_code=202)
async def post_event(
    contract_id: str,
    payload: EventPayload,
    user: dict = Depends(get_current_user),
):
    return {"contract_id": contract_id, "status": "event queued"}


@router.post("/{contract_id}/simulate", status_code=202)
async def simulate(
    contract_id: str,
    payload: SimulatePayload,
    user: dict = Depends(get_current_user),
):
    return {"contract_id": contract_id, "scenario": payload.scenario, "impact": {}}
