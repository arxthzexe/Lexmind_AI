from clause_service.classifier import ClauseClassifier, ClauseType

SAMPLE = """
1. Payment Terms
The Customer shall pay the Supplier within 30 days of invoice. Late payment
incurs a 5% fee.

2. Confidentiality
Each party shall treat the other's confidential information as proprietary.
This is a non-disclosure agreement.

3. Termination
Either party may terminate this agreement upon 30 days written notice.
"""


def test_classifier_detects_payment_clause():
    clauses = ClauseClassifier().classify(SAMPLE)
    types = {c.type for c in clauses}
    assert ClauseType.payment in types
    assert ClauseType.confidentiality in types
    assert ClauseType.termination in types


def test_classifier_unknown_for_plain_text():
    clauses = ClauseClassifier().classify("This is some generic text with no legal provisions.")
    assert clauses[0].type == ClauseType.unknown


def test_classifier_confidence_bounded():
    for clause in ClauseClassifier().classify(SAMPLE):
        assert 0.0 <= clause.confidence <= 1.0
