# LexMind AI — Step-by-Step Implementation Guide

> This document explains how the LexMind AI Enterprise Legal Intelligence Platform
> was built, phase by phase, from an empty repository to a production-ready system.
> Every step references the source design docs (`01_PROJECT_BLUEPRINT.md` … `09_ENTERPRISE_TEST_STRATEGY.md`)
> and the actual code locations in the repository.

---

## How to read this guide

Each step covers:

1. **Goal** — what the step delivers (from the design docs)
2. **What was built** — concrete files and components
3. **Verification** — how the step was validated (tests / lint / typecheck)
4. **How to run it** — commands

The canonical implementation order is defined in `08_IMPLEMENTATION_GUIDE.md`
(Phases 0–9, Milestones M1–M8). The Digital Contract Twin (`07`) is implemented
as a sub-track of Phase 5 per the agreed plan.

---

## Phase 0 — Repository & Tooling Setup

**Source:** `08_IMPLEMENTATION_GUIDE.md` §Phase 0

### Goal

Create the monorepo skeleton so every later phase has a home.

### What was built

```
lexmind-ai/
├── frontend/                 Next.js web application (Phase 6)
├── backend/
│   ├── gateway/              API Gateway service
│   ├── shared/               Shared library (config, auth, db, storage, graph, vector, LLM)
│   ├── document_service/     Upload validation + classification
│   ├── ocr_service/          OCR pipeline
│   ├── layout_service/       Layout analysis
│   ├── clause_service/       Clause segmentation + classification
│   ├── ner_service/          Named entity recognition
│   ├── obligation_service/   Obligation extraction
│   ├── risk_service/         Risk assessment
│   ├── compliance_service/   Compliance validation
│   ├── search_service/       Search API
│   ├── report_service/       Report API
│   ├── graphrag/             GraphRAG + knowledge graph engine
│   └── agent_orchestrator/   17-agent orchestration platform
├── agents/                   (reserved)
├── prompts/                  (reserved)
├── docs/                     Documentation + OpenAPI spec
├── infra/                    (reserved)
├── tests/                    Enterprise test strategy suites
└── deployment/               Docker + Kubernetes manifests
```

### What was built (files)

- `git init` + initial commit
- `.gitignore` (excludes `.venv/`, `.env`, `node_modules/`, egg-info, runtime data)
- `pyproject.toml` at root — central **ruff**, **mypy**, and **pytest** configuration

### Verification

`git log --oneline` shows the `Phase 0: scaffold repository structure` commit.

---

## Phase 1 — Core Infrastructure

**Source:** `08_IMPLEMENTATION_GUIDE.md` §Phase 1 · `02_SYSTEM_ARCHITECTURE.md` §Core Layers

### Goal

A working backend skeleton with API Gateway, JWT/RBAC authentication, and clients
for every storage system (PostgreSQL, Neo4j, Qdrant, MinIO) plus the self-hosted
AI services (vLLM LLM, BGE embeddings).

### What was built

| Component | Location | Purpose |
|---|---|---|
| Settings | `backend/shared/src/shared/config.py` | All env-config (`DATABASE_URL`, `NEO4J_URI`, `QDRANT_URL`, `VLLM_URL`, …) |
| Database | `backend/shared/src/shared/db.py` | SQLAlchemy async engine + `init_db()` (DDL creation) |
| Auth | `backend/shared/src/shared/auth.py` | JWT decode, `get_current_user`, `require_role()` RBAC dependency |
| Models | `backend/shared/src/shared/models/` | `User`, `Contract` (SQLAlchemy 2.0), `Base` with UUID PK + timestamps |
| Storage | `backend/shared/src/shared/storage.py` | MinIO (S3-compatible) upload/download/delete via aioboto3 |
| Graph client | `backend/shared/src/shared/graph.py` | Neo4j async driver + session context manager |
| Vector client | `backend/shared/src/shared/vector.py` | Qdrant collections (clause/regulation/policy/history/summary/template embeddings) |
| LLM client | `backend/shared/src/shared/llm.py` | vLLM-compatible chat client with `structured()` JSON extraction |
| Pipeline types | `backend/shared/src/shared/pipeline/types.py` | Shared DTOs: `OcrResult`, `LayoutTree`, `DocumentType`, `BBox` |
| Gateway | `backend/gateway/src/gateway/main.py` | FastAPI app: lifespan (graceful infra init), CORS, `/health`, `/version`, `/me`, `/admin`, 404 handler |

### Design decisions

- **Graceful degradation** (per `04_WORKFLOW_ENGINE.md` §Retry Policy): the gateway
  lifespan wraps each infra startup step in try/except so the API boots even when
  Postgres/Neo4j/Qdrant/MinIO are absent (test/dev). `APP_SKIP_INFRA=true` skips them.
- **Fast-fail timeouts**: `connect_args={"timeout": 2}` and
  `check_compatibility=False` on Qdrant so tests don't wait on dead services.

### Verification

```bash
.venv\Scripts\python -m pytest backend/gateway/tests/        # health + version endpoints
.venv\Scripts\python -m ruff check backend/shared/src backend/gateway/src
.venv\Scripts\python -m mypy backend/shared/src backend/gateway/src
```

---

## Phase 2 — Document Pipeline

**Source:** `08_IMPLEMENTATION_GUIDE.md` §Phase 2 · `05_DOCUMENT_AI_ENGINE.md`

### Goal

Convert raw files (PDF/DOCX/scan) into a structured document JSON:
Upload → Validation → Classification → OCR → Layout.

### What was built

| Service | File | What it does |
|---|---|---|
| `document_service` | `src/document_service/validator.py` | MIME sniffing (magic-bytes fallback, no native libmagic needed), size limits (50 MB), SHA-256, rule-based `DocumentClassifier` (NDA/Service/Supply/Employment/Lease) |
| `document_service` | `src/document_service/main.py` | `POST /validate` FastAPI app |
| `ocr_service` | `src/ocr_service/engine.py` | `OcrPipeline` with pluggable engines: **Docling** (primary) → **PaddleOCR** → **EasyOCR** (fallback), auto-selecting the highest-confidence result above a threshold (0.6) |
| `ocr_service` | `src/ocr_service/main.py` | `POST /ocr` returning pages, tables, signatures, confidence |
| `layout_service` | `src/layout_service/engine.py` | Rule-based layout engine detecting headings, numbered clauses, signatures → `LayoutTree` |
| `layout_service` | `src/layout_service/main.py` | `POST /layout` |

### Design decisions

- Heavy OCR deps (docling/paddle/easyocr) are **optional extras** in
  `ocr_service/pyproject.toml` so the base package installs and tests run without
  a GPU. Engines degrade to `RuntimeError` when unavailable and the pipeline falls back.
- The layout engine is a deterministic baseline; a vision model (InternViT/Heron,
  per `05` §Layout Analysis) can be swapped in via the `Detector` callable protocol.

### Verification

```bash
.venv\Scripts\python -m pytest backend/ocr_service/tests backend/layout_service/tests backend/document_service/tests
```

Tests cover: pipeline picks highest confidence, fallback below threshold, all-engines-down raises,
clause/signature detection, PDF acceptance, empty/oversized/unsupported rejection, NDA classification.

---

## Phase 3 — Legal Intelligence

**Source:** `08_IMPLEMENTATION_GUIDE.md` §Phase 3 · `03_AGENT_SPECIFICATION.md` §5–§10 · `05` §Clause Segmentation/NER/Obligations

### Goal

Extract structured legal entities from contract text: clauses, named entities,
obligations, risks, and compliance checks.

### What was built

| Service | Core logic | Output |
|---|---|---|
| `clause_service` | `classifier.py` — numbered-clause splitting + keyword scoring over 10 clause types (Payment, Confidentiality, Termination, Liability, Indemnity, Force Majeure, IP, Arbitration, Warranty, Governing Law) | `Clause{id, type, confidence, text, section}` |
| `ner_service` | `extractor.py` — regex baselines for Party, Date, Money, Jurisdiction, Law, Contract ID, Address | `Entity{text, type, confidence, span}` |
| `obligation_service` | `extractor.py` — "X shall/must/will Y" patterns + deadline + penalty detection, including standalone penalty sentences | `Obligation{actor, action, object, deadline, condition, penalty}` |
| `risk_service` | `assessor.py` — cue-based detection across Legal/Commercial/Financial/Operational/Compliance with Low→Critical severity | `Risk{category, severity, description}` |
| `compliance_service` | `engine.py` — required-clause policy rules (Data Protection, Confidentiality, Termination, Governing Law, Payment, Liability Cap, Force Majeure, Arbitration) | `ComplianceCheck{policy, status, message}` |

### Design decisions

- **Every service has two modes**: a deterministic rule baseline (`classify()`,
  `extract()`, `assess()`, `validate()`) and an optional LLM mode (`*_llm()`) that
  calls the shared `LlmClient` and falls back to the rule baseline when the LLM is
  unavailable or returns no parseable JSON (`shared/pipeline/jsonutil.py`).
- Outputs are Pydantic models so they serialize cleanly into the agent workflow and graph.

### Verification

```bash
.venv\Scripts\python -m pytest backend/clause_service/tests backend/ner_service/tests backend/obligation_service/tests backend/risk_service/tests backend/compliance_service/tests
```

---

## Phase 4 — GraphRAG & Knowledge Graph

**Source:** `08_IMPLEMENTATION_GUIDE.md` §Phase 4 · `06_GRAPHRAG_AND_KNOWLEDGE_GRAPH.md`

### Goal

Explainable hybrid retrieval: semantic vector search + graph traversal + policies
+ regulations, exposed as a service.

### What was built

| Module | File | Purpose |
|---|---|---|
| Embeddings | `src/graphrag/embedding.py` | BGE client (`POST /embed`) with graceful failure |
| Graph builder | `src/graphrag/builder.py` | Neo4j ontology: 11 node labels (Contract, Clause, Party, Obligation, Risk, Regulation, Policy, Amendment, Deadline, Jurisdiction, Organization), 9 relationships (CONTAINS, REFERENCES, BELONGS_TO, REQUIRES, DEPENDS_ON, VIOLATES, AMENDS, EXPIRES_ON, GOVERNED_BY); `build_contract_graph()` creates the full contract subgraph |
| Query planner | `src/graphrag/planner.py` | Intent detection: Search / Compliance / Risk / Negotiation / Comparison / Timeline |
| Hybrid retriever | `src/graphrag/retrieval.py` | Vector search → graph expansion → policy/regulation hits → intent-based ranking (6-step pipeline per `06`) |
| Context builder | `src/graphrag/context.py` | Assembles grounded context + `ExplainabilityRecord` (clause refs, graph path, regulations, evidence, confidence) and optionally answers via LLM |
| Service | `src/graphrag/main.py` | `POST /graphrag/ask`, `POST /graphrag/retrieve`, `POST /graphrag/build` |

### Verification

```bash
.venv\Scripts\python -m pytest backend/graphrag/tests
```

Covers: ontology completeness, unknown label/relationship rejection, explainability
records, grounded context building with a fake retriever, and all 6 query intents.

---

## Phase 5 — Multi-Agent Platform + Digital Contract Twin

**Source:** `08_IMPLEMENTATION_GUIDE.md` §Phase 5 · `03_AGENT_SPECIFICATION.md` · `04_WORKFLOW_ENGINE.md` · `07_DIGITAL_CONTRACT_TWIN.md`

### Goal

An autonomous 17-agent organization coordinated by the Chief Legal Officer
(Coordinator) over a LangGraph state machine, with consensus, retry, eventing,
shared memory, and a live Digital Contract Twin.

### What was built

| Component | File | Detail |
|---|---|---|
| Agent contract | `src/agent_orchestrator/contract.py` | `AgentSpec` (name, objective, inputs, outputs, tools, memory, failure strategy, default confidence), `AgentResult` (04 message format: task_id, agent, status, confidence, evidence, result), `BaseAgent` with **3-attempt retry** |
| 17 agents | `src/agent_orchestrator/agents/` | Intake, OCR, Layout, Classification, Clause, NER, Obligation, Risk, Compliance, Regulatory Intelligence, Comparison, Negotiation, Timeline, Knowledge Graph, GraphRAG, Report, Audit |
| Coordinator | `src/agent_orchestrator/coordinator.py` | LangGraph `StateGraph` chaining all 17 agents in pipeline order (14 priority + 3 extras per `08`), publishing workflow events per agent, running consensus |
| Consensus | `src/agent_orchestrator/consensus.py` | Weighted score (0.7 × confidence + 0.3 × evidence completeness) → APPROVE / REVIEW / ESCALATE |
| Event bus | `src/agent_orchestrator/eventbus.py` | 10 events (DocumentUploaded … AuditCompleted), pub/sub + history |
| Memory | `src/agent_orchestrator/memory/__init__.py` | `SharedMemory` (semantic/project/org/agent namespaces) |
| Digital Contract Twin | `src/agent_orchestrator/twin/__init__.py` | Lifecycle (Draft→…→Archived), `TwinStore`, `apply_event()` state transitions, `simulate()` what-if analysis |
| Service | `src/agent_orchestrator/main.py` | `POST /agents/review`, twin CRUD + events + simulation |

### How a review executes

```
execute(task_id, text)
  ├─ publish DocumentUploaded
  ├─ LangGraph: intake → ocr → layout → classification → clause → ner
  │   → obligation → risk → compliance → regulatory_intel → timeline
  │   → knowledge_graph → graphrag → negotiation → report → audit
  │     (each node: run agent → append result → publish its event)
  ├─ ConsensusEngine.reach(all results)
  └─ return { consensus, report, audit_trail, event_history }
```

### Digital Contract Twin sub-track

Per `07`: a live representation of each contract — identity, parties, clauses,
obligations, risks, timeline — that transitions through its lifecycle as events
are applied (sign → Signed, amendment → Amended, renewal → Renewed, expiry → Expired)
and supports what-if simulation with impacted obligations + new risk score.

### Verification

```bash
.venv\Scripts\python -m pytest backend/agent_orchestrator/tests
```

Covers: agent result serialization, consensus (approve/escalate/all-failed/empty),
event bus (publish/history/subscribe), shared memory, full 17-agent workflow with
events, and twin lifecycle/event/simulation behavior.

---

## Phase 6 — Frontend Dashboards

**Source:** `08_IMPLEMENTATION_GUIDE.md` §Phase 6 · `01_PROJECT_BLUEPRINT.md` §10

### Goal

Next.js + Tailwind web application with the 10 blueprint pages.

### What was built (`frontend/`)

| Page | Route | Notes |
|---|---|---|
| Login | `/login` | JWT flow, stores token in localStorage |
| Dashboard | `/dashboard` | Contract/obligation/risk/compliance stats |
| Upload | `/upload` | File upload → `POST /api/contracts/upload` |
| Contract Viewer | `/contracts` | Contract list table |
| Clause Explorer | `/clauses` | Detected clause types + confidence |
| Risk Dashboard | `/risk` | Risks by category + severity |
| Compliance Dashboard | `/compliance` | Policy check status |
| Comparison | `/comparison` | Two-text compare → `POST /api/contracts/compare` |
| Reports | `/reports` | Report list |
| Graph Explorer | `/graph` | Ask GraphRAG → `POST /api/graphrag/ask` |

Supporting: `components/Sidebar.tsx`, `components/Card.tsx` (Card + StatCard),
`lib/api.ts` (API client with token), `next.config.js` API rewrites.

### Verification

```bash
cd frontend && npm install && npm run build
```

Build compiles all 11 routes and type-checks successfully.

---

## Phase 7 — REST APIs & OpenAPI

**Source:** `08_IMPLEMENTATION_GUIDE.md` §Phase 7 · `01` §9 · `07` §APIs

### Goal

A documented, authenticated API surface covering the whole platform.

### API surface (20 paths)

| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/login` | JWT login |
| POST | `/contracts/upload` | Upload + queue analysis |
| GET | `/contracts/{id}` | Contract detail |
| POST | `/contracts/{id}/analyze` | Queue AI analysis (202) |
| POST | `/contracts/compare` | Compare two contracts |
| POST | `/contracts/{id}/redline` | Queue redline job (202) |
| GET | `/contracts/{id}/graph` | Knowledge graph |
| GET | `/contracts/{id}/twin` | Digital Contract Twin |
| GET | `/contracts/{id}/timeline` | Milestones |
| GET | `/contracts/{id}/obligations` | Extracted obligations |
| GET | `/contracts/{id}/risk-history` | Risk evolution |
| POST | `/contracts/{id}/events` | Twin event |
| POST | `/contracts/{id}/simulate` | What-if simulation |
| GET | `/reports/{id}` · `/reports/` | Reports |
| GET | `/search/` | Search |
| GET | `/health` · `/version` | Liveness |
| GET | `/me` · `/admin` | Auth self/RBAC |

### Documentation

- Live: `GET /docs` (Swagger UI) and `GET /openapi.json` on the gateway
- Static: `docs/openapi.json` (regenerate with `python -m gateway.openapi_export`)

### Verification

```bash
.venv\Scripts\python -m gateway.openapi_export   # writes docs/openapi.json
.venv\Scripts\python -m pytest tests/test_api.py
```

---

## Phase 8 — Enterprise Test Strategy

**Source:** `09_ENTERPRISE_TEST_STRATEGY.md` (full pyramid + coverage + targets)

### What was built (`tests/`)

| Suite | File | Coverage |
|---|---|---|
| API | `test_api.py` | Health, version, auth required/invalid, 404 handler, OpenAPI presence |
| Security | `test_security.py` | SQL injection treated as data, RBAC 403/200, JWT tampering → 401, path traversal → 404, prompt injection bounded |
| Chaos | `test_chaos.py` | OCR primary down → fallback engine; all OCR down → raise; agent 3-retry; gateway lifespan survives infra outage |
| Performance | `test_performance.py` | Clause/NER/obligation/risk under 2 s; query planning under 0.5 s; full pipeline under 10 s (targets from `09`) |

Plus 61 unit/integration tests in `backend/*/tests/`.

### Design decisions

- `APP_SKIP_INFRA=true` + monkeypatched failing startup steps keep chaos tests fast
  (~1.5 s) while still proving graceful degradation.
- Qdrant client uses `check_compatibility=False` to avoid 30 s version-check hangs.

### Verification

```bash
.venv\Scripts\python -m pytest backend/gateway/tests backend/ocr_service/tests \
  backend/layout_service/tests backend/document_service/tests backend/clause_service/tests \
  backend/ner_service/tests backend/obligation_service/tests backend/risk_service/tests \
  backend/compliance_service/tests backend/graphrag/tests backend/agent_orchestrator/tests tests/
```

**Result: 75 tests pass in ~2.2 s.**

---

## Phase 9 — Deployment & CI/CD

**Source:** `08_IMPLEMENTATION_GUIDE.md` §Phase 9 · `02` §Deployment

### What was built

| Artifact | File | Detail |
|---|---|---|
| Generic backend image | `deployment/backend.Dockerfile` | `--build-arg SERVICE=<name>` builds any service |
| Frontend image | `frontend/Dockerfile` | Multi-stage Next.js production build |
| Compose stack | `docker-compose.yml` | 20 services: infra (postgres, neo4j, qdrant, minio, vllm, embedding) + 13 backend services + frontend |
| Kubernetes | `deployment/k8s/*.yaml` | Namespace, Secrets, ConfigMap, Postgres/Neo4j/Qdrant/MinIO Stateful deployments with PVCs, vLLM + embedding deployments, gateway with HPA + LoadBalancer, Ingress |
| CI | `.github/workflows/ci.yml` | Lint → Test → Security (Trivy) → Build images (main) |
| CD | `.github/workflows/deploy.yml` | Validates compose + renders K8s after CI success |

### Verification

```bash
python -c "import yaml; yaml.safe_load(open('docker-compose.yml'))"   # compose YAML valid
python -c "import yaml,glob; [yaml.safe_load_all(open(f)) for f in glob.glob('deployment/k8s/*.yaml')]"  # manifests valid
```

---

## Milestone Map (08 §Milestones)

| Milestone | Definition | Achieved by |
|---|---|---|
| M1 | Authentication + Upload | Phase 1 + Phase 2 upload |
| M2 | OCR + Layout | Phase 2 |
| M3 | Clause Intelligence | Phase 3 |
| M4 | GraphRAG | Phase 4 |
| M5 | Multi-Agent Reasoning | Phase 5 |
| M6 | Dashboards | Phase 6 |
| M7 | Testing | Phase 8 |
| M8 | Deployment | Phase 9 |

---

## Definition of Done (applied to every phase)

- [x] Source code
- [x] Unit tests
- [x] Integration tests
- [x] API docs (OpenAPI)
- [x] Logging (structlog / stdlib loggers)
- [x] Error handling (retry + fallback + graceful degradation)
- [x] Benchmarks (performance suite)
- [x] README

Per-phase quality gate used throughout: **Design → Implement → Unit Test → Integration Test → Docs → Benchmark → Code Review → Merge** — no phase advanced until its gate passed.
