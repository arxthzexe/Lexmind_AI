
from agent_orchestrator.contract import AgentResult


def test_agent_result_defaults():
    r = AgentResult(task_id="t1", agent="x")
    assert r.status == "success"
    assert r.confidence == 0.0
    assert r.evidence == []


def test_agent_result_serialization():
    r = AgentResult(task_id="t1", agent="x", confidence=0.5, evidence=["e1"], result={"a": 1})
    d = r.model_dump()
    assert d["agent"] == "x"
    assert d["evidence"] == ["e1"]
