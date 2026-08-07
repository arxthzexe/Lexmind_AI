from graphrag.planner import QueryIntent, QueryPlanner


def test_planner_detects_compliance():
    assert QueryPlanner().plan("does this comply with GDPR?") == QueryIntent.compliance


def test_planner_detects_risk():
    assert QueryPlanner().plan("what is the liability risk here?") == QueryIntent.risk


def test_planner_detects_timeline():
    assert QueryPlanner().plan("when is the renewal deadline?") == QueryIntent.timeline


def test_planner_detects_negotiation():
    assert QueryPlanner().plan("suggest better wording for termination") == QueryIntent.negotiation


def test_planner_defaults_to_search():
    assert QueryPlanner().plan("find the payment clause") == QueryIntent.search
