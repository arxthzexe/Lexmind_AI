import pytest
from agent_orchestrator.consensus import ConsensusEngine
from agent_orchestrator.contract import AgentResult


@pytest.mark.anyio
async def test_consensus_approve():
    engine = ConsensusEngine()
    results = [
        AgentResult(task_id="t", agent="a", confidence=0.9, evidence=["e1"]),
        AgentResult(task_id="t", agent="b", confidence=0.8, evidence=["e2"]),
    ]
    consensus = engine.reach(results)
    assert consensus.recommendation == "APPROVE"
    assert consensus.confidence >= 0.7


@pytest.mark.anyio
async def test_consensus_escalate_low_confidence():
    engine = ConsensusEngine()
    results = [
        AgentResult(task_id="t", agent="a", confidence=0.2, evidence=[]),
        AgentResult(task_id="t", agent="b", confidence=0.3, evidence=[]),
    ]
    consensus = engine.reach(results)
    assert consensus.recommendation == "ESCALATE"


@pytest.mark.anyio
async def test_consensus_all_failed():
    engine = ConsensusEngine()
    results = [AgentResult(task_id="t", agent="a", status="failed")]
    consensus = engine.reach(results)
    assert consensus.recommendation == "All agents failed"


def test_consensus_empty():
    consensus = ConsensusEngine().reach([])
    assert consensus.confidence == 0.0
