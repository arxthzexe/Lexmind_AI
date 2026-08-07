# ⚖️ LexMind AI — Enterprise Legal Intelligence Platform

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Ready-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Next.js 15](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI_Backend-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python 3.12](https://img.shields.io/badge/Python_3.12-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)

**LexMind AI** is an end-to-end, multi-agent enterprise legal intelligence platform designed for autonomous contract analysis, clause segmentation, risk assessment, obligation tracking, and intelligent legal copilot assistance.

---

## 🌟 Key Features

- 🤖 **17 Autonomous Legal AI Agents**: Orchestrated consensus review covering OCR, Clause Segmentation, NER, Obligation Tracking, Risk Analysis, Compliance Audits, and Digital Contract Twins.
- 📄 **Dynamic Document Extraction**: Live PDF text parser supporting enterprise contracts and regulatory reports up to **200 MB**.
- ⚖️ **Contract Comparison & Redlining**: Side-by-side contract comparison engine with automated clause matching and difference detection.
- 💬 **Interactive Legal AI Copilot**: Slide-over AI assistant drawer accessible across all pages with quick-action prompt suggestions.
- 📊 **Real-time Enterprise Dashboards**: Centralized reactive state synchronization updating Risk, Compliance, Obligation, and Clause metrics across the entire application instantly.

---

## 📁 Repository Structure

`	ext
LexMind_AI/
├── frontend/             # Modern Next.js 15 + React 19 Frontend Web Application
│   ├── src/
│   │   ├── app/          # App Router Pages (Dashboard, Contracts, Compare, Clauses, Obligations, Risks, Reports, Upload, Search)
│   │   ├── components/   # UI System & Layout Components (AppShell, Sidebar, TopBar, CopilotDrawer)
│   │   └── lib/          # Utilities, Mock Data & Reactive Site Hook (useSiteContracts.ts)
│   ├── package.json
│   └── vercel.json
├── backend/              # 12 Python FastAPI Microservices Stack
│   ├── gateway/          # Central API Gateway & Endpoint Routing
│   ├── document_service/ # Document Validation & PyPDF Text Extractor Engine
│   ├── agent_orchestrator/# 17 Autonomous Legal AI Agents & Digital Twin Simulator
│   ├── clause_service/   # Clause Segmentation & Categorization Engine
│   ├── obligation_service/# Contract Obligation & Milestone Tracker
│   ├── risk_service/     # Legal Risk & Liability Assessor
│   ├── compliance_service/# Regulatory Compliance Audit Engine
│   ├── graphrag/         # Knowledge Graph & GraphRAG Querying
│   ├── ner_service/      # Entity Recognition Engine
│   ├── layout_service/   # Document Structural Layout Analyzer
│   ├── ocr_service/      # OCR Engine & Fallback Pipeline
│   ├── shared/           # Core Shared Utilities, Auth, DB & Configs
│   ├── tests/            # Automated Pytest Suite (Unit, Chaos, Performance, Security)
│   └── pyproject.toml
├── package.json          # Root Monorepo Delegation Package
├── vercel.json           # Root Vercel Monorepo Deployment Config
└── README.md
`

---

## 🚀 Instant Vercel Deployment

Deploying **LexMind AI** on Vercel is seamless:

1. Import your GitHub repository (https://github.com/arxthzexe/Lexmind_AI.git) into [Vercel](https://vercel.com/new).
2. Vercel automatically detects the root package.json and ercel.json configuration.
3. Click **Deploy** — Vercel builds the Next.js frontend with zero configuration needed!

---

## 🛠️ Local Development Quickstart

### 1. Frontend Setup
`ash
cd frontend
npm install
npm run dev
`
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Backend Setup
`ash
cd backend
python -m venv .venv
.\.venv\Scriptsctivate
pip install -e shared -e gateway -e document_service -e ocr_service -e layout_service -e clause_service -e ner_service -e obligation_service -e risk_service -e compliance_service -e graphrag -e agent_orchestrator --no-deps
python -m uvicorn gateway.main:app --host 0.0.0.0 --port 8000
`
API Gateway interactive documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 🧪 Running Verification Tests

`ash
# Run Backend Test Suite (23/23 Tests Passed)
cd backend
pytest tests/ -v

# Run Frontend TypeScript Verification (0 Errors)
cd frontend
npx tsc --noEmit
`

---

## 📜 License

Proprietary — All rights reserved by LexMind AI Team.
