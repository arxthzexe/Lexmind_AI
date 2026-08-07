from layout_service.engine import LayoutEngine, default_detector

SAMPLE = """
1. Definitions
Party A means the supplier.
Party B means the customer.

2. Term
This agreement commences on the Effective Date.

Signature: __________________
By: John Doe
"""


def test_layout_detects_clauses_and_signature():
    tree = LayoutEngine().analyze(SAMPLE)
    nodes = tree.pages[0]
    types = {c.node_type for c in nodes.children}
    assert "clause" in types
    assert "signature" in types


def test_default_detector_is_callable():
    detect = default_detector()
    tree = detect("1. Terms and conditions apply.")
    assert len(tree.pages) == 1
