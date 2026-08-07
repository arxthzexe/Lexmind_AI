import pytest
from agent_orchestrator.coordinator import Coordinator


@pytest.mark.anyio
async def test_coordinator_full_workflow():
    coordinator = Coordinator()
    result = await coordinator.execute(
        "contract-1",
        "This agreement between Acme Corporation and Customer shall pay $1,000 within 30 days. "
        "Confidentiality applies. Termination upon 30 days notice.",
    )
    assert result["task_id"] == "contract-1"
    assert result["consensus"]["recommendation"] in ("APPROVE", "REVIEW", "ESCALATE")
    assert result["report"] is not None
    assert result["audit_trail"] is not None
    assert "DocumentUploaded" in result["event_history"]
    assert "ReportGenerated" in result["event_history"]
    assert "AuditCompleted" in result["event_history"]


@pytest.mark.anyio
async def test_coordinator_publishes_all_events():
    coordinator = Coordinator()
    await coordinator.execute("contract-2", "Some text for the pipeline.")
    events = [e["event"] for e in coordinator.events.history()]
    assert "OCRCompleted" in events
    assert "ClauseCompleted" in events
    assert "GraphUpdated" in events
