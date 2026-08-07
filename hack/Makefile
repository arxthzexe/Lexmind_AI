.PHONY: install test lint typecheck build compose-up compose-down openapi

install:
	pip install -e backend/shared -e backend/gateway -e backend/document_service \
		-e backend/ocr_service -e backend/layout_service -e backend/clause_service \
		-e backend/ner_service -e backend/obligation_service -e backend/risk_service \
		-e backend/compliance_service -e backend/graphrag -e backend/agent_orchestrator \
		pytest anyio httpx langgraph langchain-core ruff mypy

test:
	pytest backend/gateway/tests backend/ocr_service/tests backend/layout_service/tests \
		backend/document_service/tests backend/clause_service/tests backend/ner_service/tests \
		backend/obligation_service/tests backend/risk_service/tests backend/compliance_service/tests \
		backend/graphrag/tests backend/agent_orchestrator/tests tests/

lint:
	ruff check backend tests

typecheck:
	mypy backend/shared/src backend/gateway/src backend/document_service/src \
		backend/ocr_service/src backend/layout_service/src backend/clause_service/src \
		backend/ner_service/src backend/obligation_service/src backend/risk_service/src \
		backend/compliance_service/src backend/graphrag/src backend/agent_orchestrator/src

openapi:
	python -m gateway.openapi_export

compose-up:
	docker compose up -d

compose-down:
	docker compose down
