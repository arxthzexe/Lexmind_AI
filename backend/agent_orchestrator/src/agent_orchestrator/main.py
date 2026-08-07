from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel

from agent_orchestrator.coordinator import Coordinator
from agent_orchestrator.twin import ContractTwin, TwinEvent, TwinStore

app = FastAPI(title="LexMind Agent Orchestrator", version="1.0.0")
coordinator = Coordinator()
twin_store = TwinStore()


class ReviewRequest(BaseModel):
    contract_id: str
    text: str
    filename: str = "document.txt"


class ReviewResponse(BaseModel):
    task_id: str
    consensus: dict
    report: dict | None = None
    audit_trail: list | None = None
    event_history: list[str]


@app.post("/agents/review", response_model=ReviewResponse)
async def review(payload: ReviewRequest):
    result = await coordinator.execute(payload.contract_id, payload.text, payload.filename)
    return ReviewResponse(
        task_id=payload.contract_id,
        consensus=result["consensus"],
        report=result["report"],
        audit_trail=result["audit_trail"],
        event_history=result["event_history"],
    )


@app.post("/twin/{contract_id}/events", status_code=202)
async def twin_event(contract_id: str, event: TwinEvent):
    twin_store.apply_event(contract_id, event)
    return {"status": "applied"}


@app.get("/twin/{contract_id}", response_model=ContractTwin)
async def get_twin(contract_id: str):
    return twin_store.ensure(contract_id)


@app.post("/twin/{contract_id}/simulate")
async def twin_simulate(contract_id: str, scenario: str = "noop"):
    return twin_store.simulate(contract_id, scenario)


@app.get("/health")
async def health():
    return {"status": "ok", "agents": list(coordinator.memory.snapshot().keys()) or "idle"}
