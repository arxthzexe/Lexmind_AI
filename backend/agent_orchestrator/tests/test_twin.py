from agent_orchestrator.twin import TwinEvent, TwinLifecycle, TwinStore


def test_twin_lifecycle_transitions():
    store = TwinStore()
    twin = store.ensure("c1")
    assert twin.lifecycle == TwinLifecycle.draft

    store.apply_event("c1", TwinEvent(event_type="approved"))
    assert store.get("c1").lifecycle == TwinLifecycle.signed

    store.apply_event("c1", TwinEvent(event_type="amendment"))
    assert store.get("c1").lifecycle == TwinLifecycle.amended


def test_twin_events_recorded():
    store = TwinStore()
    store.apply_event("c1", TwinEvent(event_type="sign", actor="lawyer"))
    assert len(store.get("c1").events) == 1
    assert store.get("c1").events[0].actor == "lawyer"


def test_twin_simulation():
    store = TwinStore()
    result = store.simulate("c1", "renewal delayed")
    assert "impacted_obligations" in result
    assert "recommended_actions" in result
