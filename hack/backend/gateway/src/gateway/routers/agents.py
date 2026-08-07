from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel
from agent_orchestrator.coordinator import Coordinator
from agent_orchestrator.twin import TwinStore

router = APIRouter(prefix="/agents", tags=["agents"])
coordinator = Coordinator()
twin_store = TwinStore()


class ReviewRequest(BaseModel):
    contract_id: str
    text: str
    filename: str = "document.txt"


@router.post("/review")
async def review_contract(payload: ReviewRequest):
    result = await coordinator.execute(payload.contract_id, payload.text, payload.filename)
    return {
        "task_id": payload.contract_id,
        "consensus": result["consensus"],
        "report": result["report"],
        "audit_trail": result["audit_trail"],
        "event_history": result["event_history"],
    }


@router.get("/status")
async def get_agent_status():
    return {
        "agents": [
            {"id": "agt-1", "name": "Chief Legal Officer", "role": "Orchestrator", "status": "Active", "confidence": 100},
            {"id": "agt-2", "name": "Intake Agent", "role": "Ingestion", "status": "Active", "confidence": 99},
            {"id": "agt-3", "name": "OCR Agent", "role": "Processing", "status": "Active", "confidence": 97},
            {"id": "agt-4", "name": "Layout Agent", "role": "Parsing", "status": "Active", "confidence": 95},
            {"id": "agt-5", "name": "Classification Agent", "role": "Categorization", "status": "Active", "confidence": 98},
            {"id": "agt-6", "name": "Clause Agent", "role": "Extraction", "status": "Active", "confidence": 94},
            {"id": "agt-7", "name": "NER Agent", "role": "Entity Recognition", "status": "Active", "confidence": 96},
            {"id": "agt-8", "name": "Obligation Agent", "role": "Tracking", "status": "Active", "confidence": 92},
            {"id": "agt-9", "name": "Risk Agent", "role": "Analysis", "status": "Active", "confidence": 91},
            {"id": "agt-10", "name": "Compliance Agent", "role": "Auditing", "status": "Active", "confidence": 97},
            {"id": "agt-11", "name": "Regulatory Agent", "role": "Monitoring", "status": "Active", "confidence": 95},
            {"id": "agt-12", "name": "Comparison Agent", "role": "Redlining", "status": "Active", "confidence": 93},
            {"id": "agt-13", "name": "Negotiation Agent", "role": "Strategy", "status": "Active", "confidence": 88},
            {"id": "agt-14", "name": "Timeline Agent", "role": "Scheduling", "status": "Active", "confidence": 99},
            {"id": "agt-15", "name": "Knowledge Graph Agent", "role": "Mapping", "status": "Active", "confidence": 94},
            {"id": "agt-16", "name": "GraphRAG Agent", "role": "Querying", "status": "Active", "confidence": 95},
            {"id": "agt-17", "name": "Report Agent", "role": "Generation", "status": "Active", "confidence": 98},
        ]
    }
