# 02_SYSTEM_ARCHITECTURE.md

# Enterprise Legal Intelligence Platform (LexMind AI)
## System Architecture v1.0

---

# Purpose

This document defines the production architecture of LexMind AI and the interaction between services, AI components, storage, and autonomous agents.

---

# Architecture Principles

- API-first
- Microservices
- Event-driven
- Async processing
- GraphRAG
- Multi-agent orchestration
- Explainable AI
- Secure by default

---

# Core Layers

## Presentation Layer

- Next.js Web
- Admin Dashboard
- Contract Workspace
- Compliance Dashboard
- Risk Dashboard
- Knowledge Graph Explorer

---

## API Layer

- API Gateway
- Authentication
- RBAC
- Rate Limiting
- Audit Middleware

---

## Business Services

- Contract Service
- OCR Service
- Layout Service
- Clause Intelligence
- NER Service
- Obligation Service
- Risk Service
- Compliance Service
- Search Service
- Report Service

---

## AI Layer

- OCR Pipeline
- Layout Understanding
- Embedding Service
- GraphRAG Engine
- LLM Reasoning
- Multi-Agent Orchestrator

---

## Storage Layer

PostgreSQL
- Users
- Contracts
- Clauses
- Obligations
- Risks
- Audit Logs

Neo4j
- Contract Graph
- Clause Graph
- Regulation Graph
- Obligation Graph

Qdrant
- Clause Embeddings
- Regulation Embeddings
- Policy Embeddings

MinIO
- Original Files
- OCR Output
- Reports

---

# End-to-End Processing

1. Upload Contract
2. OCR
3. Layout Analysis
4. Clause Segmentation
5. NER
6. Obligation Extraction
7. Risk Classification
8. Compliance Validation
9. Embedding Generation
10. Knowledge Graph Update
11. GraphRAG Retrieval
12. Multi-Agent Review
13. Explainability
14. Dashboard

---

# Event Flow

UploadCompleted
-> OCRCompleted
-> LayoutCompleted
-> ClauseExtractionCompleted
-> GraphIndexed
-> ComplianceCompleted
-> ReportGenerated

---

# Agent Interaction

Coordinator
|
|-- Intake Agent
|-- OCR Agent
|-- Clause Agent
|-- Obligation Agent
|-- Risk Agent
|-- Compliance Agent
|-- Legal Research Agent
|-- Negotiation Agent
|-- Report Agent

Coordinator merges evidence and produces final recommendation.

---

# GraphRAG

Hybrid Retrieval:

Vector Search
+
Knowledge Graph Traversal
+
Enterprise Policies
+
Historical Contracts

---

# Security

- JWT
- RBAC
- Audit Logs
- Encryption
- Versioning
- Immutable Reports

---

# Deployment

Frontend
|
API Gateway
|
FastAPI Services
|
PostgreSQL + Neo4j + Qdrant + MinIO

Docker containers orchestrated for horizontal scaling.

---

# Phase-wise Implementation

Phase 1:
Authentication + Upload

Phase 2:
OCR + Layout

Phase 3:
Clause Intelligence

Phase 4:
GraphRAG

Phase 5:
Agents

Phase 6:
Dashboards

Phase 7:
Testing + Deployment

---

# Success Metrics

- Clause Extraction Accuracy
- Obligation Accuracy
- Compliance Precision
- Risk Detection Precision
- Response Latency
- Explainability Coverage
- User Satisfaction
