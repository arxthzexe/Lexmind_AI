"""Performance benchmarks per 09 §Performance Tests (targets <2s/<1s/<10s/<500ms)."""

import time

from clause_service.classifier import ClauseClassifier
from graphrag.planner import QueryPlanner
from ner_service.extractor import NerExtractor
from obligation_service.extractor import ObligationExtractor
from risk_service.assessor import RiskAssessor

CONTRACT_TEXT = """
1. Definitions
Party A means the supplier. Party B means the customer.
2. Term
This agreement commences on January 1, 2025 and expires December 31, 2027.
3. Payment
The Customer shall pay $50,000 within 30 days of invoice.
Late payment incurs a penalty of 1.5% per month.
4. Confidentiality
Each party shall keep confidential information secret.
5. Termination
Either party may terminate upon 30 days notice.
""" * 20  # ~200 clauses


def _timeit(fn, *args):
    start = time.perf_counter()
    fn(*args)
    return time.perf_counter() - start


def test_clause_classification_speed():
    elapsed = _timeit(ClauseClassifier().classify, CONTRACT_TEXT)
    assert elapsed < 2.0, f"clause classification took {elapsed:.2f}s"


def test_ner_extraction_speed():
    elapsed = _timeit(NerExtractor().extract, CONTRACT_TEXT)
    assert elapsed < 2.0, f"NER took {elapsed:.2f}s"


def test_obligation_extraction_speed():
    elapsed = _timeit(ObligationExtractor().extract, CONTRACT_TEXT)
    assert elapsed < 2.0, f"obligations took {elapsed:.2f}s"


def test_risk_assessment_speed():
    elapsed = _timeit(RiskAssessor().assess, CONTRACT_TEXT)
    assert elapsed < 2.0, f"risk took {elapsed:.2f}s"


def test_query_planning_speed():
    planner = QueryPlanner()
    elapsed = _timeit(planner.plan, "what is the liability risk?")
    assert elapsed < 0.5, f"planning took {elapsed:.2f}s"


def test_full_pipeline_analysis_under_10s():
    """End-to-end rule pipeline (analysis target <10s)."""
    start = time.perf_counter()
    clauses = ClauseClassifier().classify(CONTRACT_TEXT)
    entities = NerExtractor().extract(CONTRACT_TEXT)
    obligations = ObligationExtractor().extract(CONTRACT_TEXT)
    risks = RiskAssessor().assess(CONTRACT_TEXT)
    elapsed = time.perf_counter() - start
    assert len(clauses) >= 1
    assert len(entities) >= 1
    assert len(obligations) >= 1
    assert len(risks) >= 1
    assert elapsed < 10.0, f"full analysis took {elapsed:.2f}s"
