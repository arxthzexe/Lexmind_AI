# LexMind AI — Workflow Documentation

> This document describes how a document moves through the LexMind AI platform —
> from upload to explainable recommendation — and how the multi-agent system,
> state machine, event bus, consensus engine, and Digital Contract Twin interact.
> It is the operational companion to `04_WORKFLOW_ENGINE.md` and `03_AGENT_SPECIFICATION.md`.

---

## 1. Workflow Principles

The platform is governed by the principles in `04_WORKFLOW_ENGINE.md` §Workflow Principles:

- Event-driven
- State-based execution
- Parallel agents
- Shared memory
- Explainable outputs
- Human approval for critical actions
- Retry and recovery
- Full audit trail

---

## 2. Global Workflow (End-to-End)

```
START
  ↓
Document Upload                (POST /contracts/upload → stored in MinIO, row in PostgreSQL)
  ↓
Document Validation            (document_service: MIME, size, SHA-256)
  ↓
OCR & Layout Analysis          (ocr_service Docling→Paddle→EasyOCR; layout_service)
  ↓
Document Classification        (NDA / Service / Supply / Employment / Lease / Other)
  ↓
Clause Segmentation            (clause_service: 10 clause types)
  ↓
NER + Obligation Extraction    (ner_service + obligation_service, parallel)
  ↓
Knowledge Graph Update         (graphrag/builder → Neo4j)
  ↓
Embedding Generation           (BGE → Qdrant collections)
  ↓
GraphRAG Retrieval             (vector + graph + policy + regulation)
  ↓
Risk Assessment                (risk_service: 5 categories, 4 severities)
  ↓
Compliance Validation          (compliance_service: required policy clauses)
  ↓
Contract Comparison (Optional) (comparison agent → delta report)
  ↓
Negotiation Suggestions        (negotiation agent → alternatives/redlines)
  ↓
Executive Report               (report agent → executive/legal/risk summaries)
  ↓
Audit Logging                  (audit agent → full decision trace)
  ↓
END
```

This same chain is what the multi-agent Coordinator executes in a single call to
`POST /agents/review` (see §5).

---

## 3. State Machine

Defined in `04_WORKFLOW_ENGINE.md` §State Machine. The Coordinator drives these
states as the pipeline advances:

```
INIT
 → INGESTION          (intake + validation)
 → OCR_COMPLETE       (ocr + layout)
 → STRUCTURE_COMPLETE (classification + clause segmentation)
 → CLAUSE_COMPLETE    (clause + NER + obligations)
 → KNOWLEDGE_READY    (knowledge graph + embeddings + GraphRAG)
 → RISK_READY         (risk assessment)
 → COMPLIANCE_READY   (compliance validation)
 → REVIEW_READY       (negotiation/comparison inputs assembled)
 → REPORT_READY       (executive report generated)
 → COMPLETED          (audit stored, events finalized)
```

Failure handling (any stage):

```
FAILED
 → Retry (up to 3 attempts)
 → Alternate tool / fallback engine
 → Escalate to human review (when confidence is too low or evidence missing)
```

Implemented in `agent_orchestrator/contract.py` (`BaseAgent.run` retries 3×) and
the coordinator's `execute()` flow.

---

## 4. Agent Topology

```
Chief Legal Officer (Coordinator)
├── Contract Intake Agent          intake.py
├── OCR Agent                      ocr.py
├── Layout Analysis Agent          layout.py
├── Document Classification Agent  classification.py
├── Clause Intelligence Agent      clause.py
├── NER Agent                      ner.py
├── Obligation Extraction Agent    obligation.py
├── Risk Assessment Agent          risk.py
├── Compliance Validation Agent    compliance.py
├── Regulatory Intelligence Agent  regulatory.py
├── Contract Comparison Agent      comparison.py
├── Negotiation Agent              negotiation.py
├── Timeline Agent                 timeline.py
├── Knowledge Graph Agent          knowledge_graph.py
├── GraphRAG Agent                 graphrag.py
├── Executive Report Agent         report.py
└── Audit Agent                    audit.py
```

### Common Agent Contract

Every agent defines (per `03` §Common Agent Contract) — implemented as `AgentSpec`:

| Field | Meaning |
|---|---|
| `objective` | What the agent is responsible for |
| `inputs` / `outputs` | Named data the agent consumes/produces |
| `tools` | Services it may call (docling, paddleocr, graph_builder, hybrid_retriever, …) |
| `memory` | Which memory namespaces it can read/write |
| `failure_strategy` | `retry:3; fallback; escalate` |
| `default_confidence` | Baseline confidence when producing output |

Every agent returns `AgentResult{task_id, agent, status, confidence, evidence, result}`.

---

## 5. How the Coordinator Executes a Review

Call: `POST /agents/review` with `{contract_id, text, filename}`.

```python
async def execute(task_id, text, filename):
    1. publish(DocumentUploaded)
    2. write task text into SharedMemory
    3. graph.ainvoke({task_id, text, filename, phase: INIT, results: []})
         intake → ocr → layout → classification → clause → ner
         → obligation → risk → compliance → regulatory_intel → timeline
         → knowledge_graph → graphrag → negotiation → report → audit
         (each node runs its agent, appends AgentResult, publishes its event)
    4. ConsensusEngine.reach(all results)          # weighted confidence
    5. extract report.result + audit result
    6. return {consensus, report, audit_trail, event_history}
```

Implemented in `agent_orchestrator/coordinator.py`.

---

## 6. Parallel Execution Groups

`04_WORKFLOW_ENGINE.md` §Parallel Tasks defines the groups that may run in
parallel. The LangGraph coordinator currently runs agents sequentially (each
stage's input depends on the previous stage), and the groups below document the
intended concurrency model for the production graph:

| Group | Agents | Parallelizable because |
|---|---|---|
| A | OCR, Layout | Both consume the raw upload |
| B | Clause, NER, Metadata | All consume the layout tree |
| C | Embeddings, Graph Update | Both consume clause/NER outputs |
| D | Risk, Compliance | Both consume clauses + GraphRAG context |
| E | Reporting, Audit | Both consume every prior result |

---

## 7. Shared Memory

`agent_orchestrator/memory/__init__.py` implements the four namespaces from
`04` §Shared Memory:

| Namespace | Contents |
|---|---|
| Semantic | Regulations, policies (knowledge, long-lived) |
| Project | Current contract under review |
| Organization | Internal playbooks and rules |
| Agent | Intermediate outputs produced by each agent |

The `SharedMemory` API: `set(key, value)`, `get(key, default)`, `update(key, patch)`, `snapshot()`.

---

## 8. Agent Communication Protocol

All inter-agent communication is **structured JSON** (`03` §Communication Protocol):

```json
{
  "task_id": "contract-1",
  "agent": "risk",
  "status": "success",
  "confidence": 0.65,
  "evidence": ["identified 3 risks"],
  "result": { "risks": [...] }
}
```

Coordinator → Agent: dispatch with `_agent_inputs()` mapping shared state to each
agent's declared inputs. Agent → Coordinator: `AgentResult`. Coordinator merges
all results and produces the final recommendation (consensus).

---

## 9. Consensus Engine

`agent_orchestrator/consensus.py` implements `04` §Consensus Engine:

```
score = 0.7 × avg(agent confidence) + 0.3 × (agents with evidence / total agents)

score ≥ 0.75 → APPROVE
score ≥ 0.50 → REVIEW
score  < 0.50 → ESCALATE
```

Each reasoning agent contributes its recommendation + confidence + evidence; the
Coordinator computes the final recommendation with full per-agent detail preserved
for the audit trail.

---

## 10. Event Bus

`agent_orchestrator/eventbus.py` implements the 10 events from `04` §Event Bus:

| Event | Published when |
|---|---|
| `DocumentUploaded` | Intake agent completes |
| `OCRCompleted` | OCR agent completes |
| `LayoutCompleted` | Layout agent completes |
| `ClauseCompleted` | Clause agent completes |
| `NERCompleted` | NER / Obligation agents complete |
| `GraphUpdated` | Knowledge Graph agent completes |
| `RiskCompleted` | Risk agent completes |
| `ComplianceCompleted` | Compliance agent completes |
| `ReportGenerated` | Report agent completes |
| `AuditCompleted` | Audit agent completes |

Subscribers can register via `bus.subscribe(event, handler)`; every event is
appended to `bus.history()` for observability.

---

## 11. Human Approval Gates

Per `04` §Human Approval, a human review is automatically requested when:

- A **critical legal risk** is detected (severity Critical)
- **Evidence is missing** for a recommendation
- **Confidence is low** (< 0.5 → consensus ESCALATE)
- A **policy conflict** is found (compliance Violation)

The ConsensusEngine's ESCALATE outcome is the trigger; downstream actions
(executing a redline, signing) remain gated on human confirmation.

---

## 12. Retry & Fallback Policy

`04` §Retry Policy:

| Layer | Primary | Fallback |
|---|---|---|
| OCR | Docling | PaddleOCR → EasyOCR |
| Retrieval | Vector search | Graph traversal |
| LLM | vLLM primary model | Rule-based baselines (all services degrade gracefully) |
| Agents | First attempt | 2 more retries → failed result with error |

Implemented in `ocr_service/engine.py` (engine chain) and `contract.py`
(3-attempt loop).

---

## 13. GraphRAG Retrieval Pipeline

`graphrag/retrieval.py` implements the 6-step hybrid retrieval from `06` §Hybrid Retrieval:

```
1. Vector Search        BGE embedding of query → Qdrant (clause collection)
2. Graph Expansion      Traverse Neo4j from seed clauses (contract_id scoped)
3. Policy Retrieval     Qdrant policy collection
4. Regulation Retrieval Qdrant regulation collection
5. Context Ranking      Intent-aware ordering (compliance/risk prioritize policy+regulation)
6. LLM Reasoning        ContextBuilder.answer() grounds the LLM response
```

**Explainability** — every answer carries (`06` §Explainability):

- Clause references
- Graph path
- Supporting regulation
- Similar contract
- Confidence score
- Evidence chain

Implemented as `ExplainabilityRecord.to_dict()` in `graphrag/context.py`.

---

## 14. Knowledge Graph Ontology

`graphrag/builder.py` implements the `06` ontology:

```
Nodes:     Contract, Clause, Party, Obligation, Risk, Regulation, Policy,
           Amendment, Deadline, Jurisdiction, Organization
Relations: CONTAINS, REFERENCES, BELONGS_TO, REQUIRES, DEPENDS_ON,
           VIOLATES, AMENDS, EXPIRES_ON, GOVERNED_BY
```

`build_contract_graph()` creates: Contract node → CONTAINS clauses → REQUIRES
obligations → DEPENDS_ON risks → BELONGS_TO parties → GOVERNED_BY jurisdiction.

---

## 15. Digital Contract Twin (Sub-track of Phase 5)

`agent_orchestrator/twin/__init__.py` implements `07_DIGITAL_CONTRACT_TWIN.md`.

### Lifecycle

```
Draft → Review → Negotiation → Approved → Signed → Active → Amended → Renewed → Expired → Archived
```

### Event sources → state transitions

| Event | Transition |
|---|---|
| `approved` | → Signed |
| `amendment` | → Amended |
| `renewal` | → Renewed |
| `expiry` | → Expired |

### What-if simulation

`POST /contracts/{id}/simulate` returns:

- Impacted obligations
- New risk score
- Compliance impact
- Recommended actions

### APIs

```
GET  /contracts/{id}/twin
GET  /contracts/{id}/timeline
GET  /contracts/{id}/obligations
GET  /contracts/{id}/risk-history
POST /contracts/{id}/events
POST /contracts/{id}/simulate
```

---

## 16. API Endpoints by Workflow Stage

| Stage | API |
|---|---|
| Ingest | `POST /contracts/upload` |
| Analyze | `POST /contracts/{id}/analyze` |
| Compare | `POST /contracts/compare` |
| Redline | `POST /contracts/{id}/redline` |
| Retrieve | `POST /graphrag/ask` (or `GET /search/`) |
| Report | `GET /reports/{id}` |
| Graph | `GET /contracts/{id}/graph` |
| Twin | twin endpoints above |
| Auth | `POST /auth/login`, `GET /me`, `GET /admin` |

Full OpenAPI: `docs/openapi.json` or `GET /docs` on the gateway.

---

## 17. Observability

Per `04` §Observability, the platform tracks:

- Workflow duration
- Agent latency (per-node in LangGraph)
- Retry count (`BaseAgent` logs each attempt)
- Confidence (every `AgentResult`)
- Token usage (LLM client, when available)
- Retrieval accuracy (benchmarked in `tests/test_performance.py`)

Every event is recorded on the EventBus history and every agent decision lands in
the audit trail (`audit.result.audit_trail`).

---

## 18. Completion Criteria

Per `04` §Completion Criteria, a workflow is **COMPLETED** only when:

- All mandatory agents succeed (or fall back within policy)
- Reports generated
- Audit stored
- Knowledge graph updated
- Embeddings indexed
- Dashboard refreshed (frontend consumes the API surface)

The `Coordinator.execute()` return value includes `consensus`, `report`,
`audit_trail`, and `event_history`, which together prove all six criteria.
