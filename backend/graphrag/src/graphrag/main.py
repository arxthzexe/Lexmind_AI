from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel

from graphrag.builder import GraphBuilder
from graphrag.context import ContextBuilder
from graphrag.planner import QueryPlanner
from graphrag.retrieval import HybridRetriever

app = FastAPI(title="LexMind GraphRAG Service", version="1.0.0")
planner = QueryPlanner()
builder = GraphBuilder()
retriever = HybridRetriever()
context = ContextBuilder(retriever=retriever)


class Question(BaseModel):
    query: str


class AnswerResponse(BaseModel):
    answer: str
    intent: str
    explainability: dict


@app.post("/graphrag/ask", response_model=AnswerResponse)
async def ask(payload: Question):
    intent = planner.plan(payload.query)
    result = await context.answer(payload.query, intent)
    return AnswerResponse(**result)


@app.post("/graphrag/retrieve")
async def retrieve(payload: Question):
    intent = planner.plan(payload.query)
    return await retriever.retrieve(payload.query, intent)


class ContractGraph(BaseModel):
    contract_id: str
    title: str
    jurisdiction: str | None = None
    clauses: list[dict] = []
    parties: list[str] = []
    obligations: list[dict] = []
    risks: list[dict] = []


@app.post("/graphrag/build", status_code=202)
async def build_graph(payload: ContractGraph):
    await builder.build_contract_graph(
        contract_id=payload.contract_id,
        title=payload.title,
        jurisdiction=payload.jurisdiction,
        clauses=payload.clauses,
        parties=payload.parties,
        obligations=payload.obligations,
        risks=payload.risks,
    )
    return {"status": "graph built", "contract_id": payload.contract_id}


@app.get("/health")
async def health():
    return {"status": "ok"}
