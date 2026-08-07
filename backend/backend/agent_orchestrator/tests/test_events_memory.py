import pytest
from agent_orchestrator.eventbus import EventBus, WorkflowEvent
from agent_orchestrator.memory import SharedMemory


@pytest.mark.anyio
async def test_event_bus_publish_and_history():
    bus = EventBus()
    await bus.publish(WorkflowEvent.ocr_completed, {"contract_id": "c1"})
    history = bus.history()
    assert history[0]["event"] == "OCRCompleted"
    assert history[0]["payload"]["contract_id"] == "c1"


@pytest.mark.anyio
async def test_event_bus_subscribe():
    bus = EventBus()
    seen = []

    async def handler(event, payload):
        seen.append((event, payload))

    bus.subscribe(WorkflowEvent.risk_completed, handler)
    await bus.publish(WorkflowEvent.risk_completed, {"risk": "high"})
    assert len(seen) == 1
    assert seen[0][1]["risk"] == "high"


def test_shared_memory_set_get_update():
    memory = SharedMemory()
    memory.set("contract:id", {"title": "NDA"})
    assert memory.get("contract:id")["title"] == "NDA"
    memory.update("contract:id", {"status": "active"})
    assert memory.get("contract:id")["status"] == "active"
