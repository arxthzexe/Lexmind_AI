from obligation_service.extractor import ObligationExtractor

SAMPLE = """
The Supplier shall deliver the goods by January 15, 2025.
The Customer must pay within 30 days. Late payment incurs a penalty of $500.
"""


def test_extracts_obligations():
    obligations = ObligationExtractor().extract(SAMPLE)
    assert len(obligations) >= 1
    modal_obligations = [o for o in obligations if not o.id.startswith("oblig-penalty")]
    assert all(o.actor and o.action for o in modal_obligations)


def test_extracts_deadlines():
    obligations = ObligationExtractor().extract(SAMPLE)
    deadlines = [o.deadline for o in obligations]
    assert any(d and "January" in d for d in deadlines)
    assert any(d and "30 days" in d for d in deadlines)


def test_extracts_penalty():
    obligations = ObligationExtractor().extract(SAMPLE)
    penalties = [o.penalty for o in obligations]
    assert any("$500" in (p or "") for p in penalties)
