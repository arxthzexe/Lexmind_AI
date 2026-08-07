# 04_WORKFLOW_ENGINE.md

# Enterprise Legal Intelligence Platform (LexMind AI)
## Autonomous Workflow Engine

---

# Purpose

This document defines how autonomous legal AI agents collaborate from
document ingestion to final legal recommendations.

The workflow engine is implemented as a state machine with dynamic task
planning, parallel execution, shared memory, and explainable decision
making.

---

# Workflow Principles

- Event-driven
- State-based execution
- Parallel agents
- Shared memory
- Explainable outputs
- Human approval for critical actions
- Retry and recovery
- Full audit trail

---

# Global Workflow

START
↓
Document Upload
↓
Document Validation
↓
OCR & Layout Analysis (Parallel)
↓
Document Classification
↓
Clause Segmentation
↓
NER + Obligation Extraction (Parallel)
↓
Knowledge Graph Update
↓
Embedding Generation
↓
GraphRAG Retrieval
↓
Risk Assessment
↓
Compliance Validation
↓
Contract Comparison (Optional)
↓
Negotiation Suggestions
↓
Executive Report
↓
Audit Logging
↓
END

---

# State Machine

INIT
→ INGESTION
→ OCR_COMPLETE
→ STRUCTURE_COMPLETE
→ CLAUSE_COMPLETE
→ KNOWLEDGE_READY
→ RISK_READY
→ COMPLIANCE_READY
→ REVIEW_READY
→ REPORT_READY
→ COMPLETED

If any stage fails:

FAILED
→ Retry
→ Alternate Tool
→ Human Review

---

# LangGraph Execution

Coordinator

├── Intake

├── OCR

├── Layout

├── Clause

├── NER

├── Obligation

├── Graph

├── GraphRAG

├── Risk

├── Compliance

├── Negotiation

└── Reporting

Coordinator synchronizes all results before final reasoning.

---

# Parallel Tasks

Group A
- OCR
- Layout

Group B
- Clause
- NER
- Metadata

Group C
- Embeddings
- Graph Update

Group D
- Risk
- Compliance

Group E
- Reporting
- Audit

---

# Shared Memory

Semantic Memory
- Regulations
- Policies

Project Memory
- Current contract

Organization Memory
- Internal playbooks

Agent Memory
- Intermediate outputs

---

# Agent Communication

Message Format

{
  "task_id":"",
  "agent":"",
  "status":"",
  "confidence":0.0,
  "evidence":[],
  "result":{}
}

---

# Consensus Engine

Each reasoning agent returns:

- Recommendation
- Confidence
- Supporting evidence

Coordinator computes final recommendation based on weighted confidence
and evidence completeness.

---

# Human Approval

Automatically request review when:

- Critical legal risk
- Missing evidence
- Low confidence
- Policy conflict

---

# Retry Policy

Retry: 3 attempts

Fallback:

Primary OCR -> Secondary OCR

Primary Retrieval -> Graph Retrieval

Primary LLM -> Backup LLM

---

# Workflow Definitions

## Contract Review

Upload
→ OCR
→ Layout
→ Clauses
→ Risks
→ Compliance
→ Report

## Contract Comparison

Upload A
Upload B
→ Compare Clauses
→ Compare Obligations
→ Compare Risks
→ Delta Report

## Compliance Review

Upload
→ GraphRAG
→ Policy Retrieval
→ Compliance Engine
→ Violations
→ Recommendations

## Negotiation

Upload
→ Risk Analysis
→ Alternative Clauses
→ Redlining
→ Negotiation Report

---

# Event Bus

Events

DocumentUploaded
OCRCompleted
LayoutCompleted
ClauseCompleted
NERCompleted
GraphUpdated
RiskCompleted
ComplianceCompleted
ReportGenerated
AuditCompleted

---

# Observability

Track

- Workflow duration
- Agent latency
- Retry count
- Confidence
- Token usage
- Retrieval accuracy

---

# Completion Criteria

Workflow completes only when:

- All mandatory agents succeed
- Reports generated
- Audit stored
- Knowledge graph updated
- Embeddings indexed
- Dashboard refreshed
