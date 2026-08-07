# LexMind AI — Enterprise Legal Intelligence Platform

Autonomous AI platform for contract intelligence: OCR, layout analysis, clause
extraction, obligation tracking, risk analysis, compliance validation, GraphRAG,
knowledge graphs, multi-agent reasoning, and explainable recommendations.

Built from the design docs in `docs/` (01–09).

## Architecture

```
frontend/            Next.js 15 + Tailwind dashboards
backend/
  gateway/           FastAPI API gateway (JWT/RBAC, 20+ endpoints, OpenAPI)
  shared/            Shared config, DB, auth, storage, graph, vector, LLM client
  document_service/  Upload validation + document classification
  ocr_service/       OCR pipeline (Docling → PaddleOCR → EasyOCR fallback)
  layout_service/    Layout analysis (clause boundaries, signatures, tables)
  clause_service/    Clause segmentation + classification (10 types)
  ner_service/       NER (parties, dates, money, jurisdiction, laws…)
  obligation_service/ Obligation extraction (actor/action/deadline/penalty)
  risk_service/      Risk assessment (legal/commercial/financial/operational)
  compliance_service/ Compliance validation (policy rules)
  search_service/    Vector search API
  report_service/    Report API
  graphrag/          Embeddings (BGE), Neo4j graph builder, hybrid retrieval,
                     query planner, context builder + explainability
  agent_orchestrator/ 17-agent LangGraph coordinator, consensus, event bus,
                     shared memory, Digital Contract Twin
deployment/          Docker + Kubernetes manifests
tests/               Enterprise test strategy (API/security/chaos/perf)
```

## Quick start (Docker Compose)

```bash
cp .env.example .env   # (or use defaults)
docker compose up -d
# Gateway:   http://localhost:80  (OpenAPI at /docs)
# Frontend:  http://localhost:3000
# Neo4j:     http://localhost:7474
# Qdrant:    http://localhost:6333
# MinIO:     http://localhost:9001
```

## Local development

```bash
# Backend
python -m venv .venv && .venv\Scripts\activate   # Windows
pip install -e backend/shared -e backend/gateway -e backend/*/   # all services
uvicorn gateway.main:app --reload

# Frontend
cd frontend && npm install && npm run dev
```

## Tests

```bash
pip install pytest anyio httpx langgraph langchain-core
pytest backend/*/tests tests/
```

75 tests covering: unit (services/agents), integration (pipeline), API
(20 endpoints), security (SQLi, prompt injection, RBAC, JWT tampering, path
traversal), chaos (OCR/LLM/graph outages → retry/fallback/degrade), and
performance (upload <2s, search <1s, analysis <10s, graph <500ms).

## CI/CD

GitHub Actions (`.github/workflows/`):

```
Lint → Test → Security (Trivy) → Build/package (main only) → Deploy
```

## APIs

Full OpenAPI spec at `docs/openapi.json` or `GET /docs` on the gateway.

| Method | Path | Purpose |
|---|---|---|
| POST | /auth/login | JWT login |
| POST | /contracts/upload | Upload contract |
| GET | /contracts/{id} | Contract detail |
| POST | /contracts/{id}/analyze | Queue AI analysis |
| POST | /contracts/compare | Compare two contracts |
| POST | /contracts/{id}/redline | Queue redline job |
| GET | /contracts/{id}/graph | Knowledge graph for contract |
| GET | /contracts/{id}/twin | Digital Contract Twin |
| GET | /contracts/{id}/timeline | Contract milestones |
| GET | /contracts/{id}/obligations | Extracted obligations |
| GET | /contracts/{id}/risk-history | Risk evolution |
| POST | /contracts/{id}/events | Twin event |
| POST | /contracts/{id}/simulate | What-if simulation |
| GET | /reports/{id} | Generated report |
| GET | /search/ | Semantic search |

## AI stack

- **LLM**: self-hosted Mistral-7B-Instruct via vLLM (swap any OpenAI-compatible model)
- **Embeddings**: BGE-M3 via embedding service → Qdrant
- **Knowledge graph**: Neo4j (11 node types, 9 relationship types)
- **Orchestration**: LangGraph state machine (17 agents, 3-retry, consensus, event bus)
