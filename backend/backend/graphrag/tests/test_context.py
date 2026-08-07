import pytest
from graphrag.context import ContextBuilder, ExplainabilityRecord
from graphrag.planner import QueryIntent
from graphrag.retrieval import HybridRetriever


class FakeRetriever(HybridRetriever):
    async def retrieve(self, query, intent, *, contract_id=None, top_k=5):
        return [
            {
                "id": "clause-1",
                "source": "clause",
                "text": "Payment shall be made within 30 days of invoice.",
            },
            {
                "id": "reg-1",
                "source": "regulation",
                "text": "GDPR Article 5 requires lawful processing.",
            },
        ]


def test_explainability_record_defaults():
    record = ExplainabilityRecord()
    assert record.clause_refs == []
    assert record.confidence == 0.0


def test_explainability_to_dict():
    record = ExplainabilityRecord(
        clause_refs=["clause-1"], evidence=["clause: text"], confidence=0.8
    )
    d = record.to_dict()
    assert d["clause_refs"] == ["clause-1"]
    assert d["confidence"] == 0.8


@pytest.mark.anyio
async def test_context_builder_grounds_answer():
    builder = ContextBuilder(retriever=FakeRetriever(), llm=None)
    context, record = await builder.build("payment terms", QueryIntent.search)
    assert "30 days" in context
    assert record.clause_refs == ["clause-1"]
    assert len(record.evidence) == 2


@pytest.mark.anyio
async def test_context_builder_answer_no_llm():
    builder = ContextBuilder(retriever=FakeRetriever(), llm=None)
    result = await builder.answer("payment terms", QueryIntent.search)
    assert result["intent"] == "Search"
    assert result["explainability"]["confidence"] > 0
