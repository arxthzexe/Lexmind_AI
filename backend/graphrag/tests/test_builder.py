import pytest
from graphrag.builder import NODE_LABELS, RELATIONSHIPS, GraphBuilder


def test_ontology_labels():
    node_labels = {"Contract", "Clause", "Party", "Obligation", "Risk", "Regulation", "Deadline"}
    rels = {"CONTAINS", "REFERENCES", "REQUIRES", "DEPENDS_ON", "VIOLATES", "GOVERNED_BY"}
    assert node_labels <= NODE_LABELS
    assert rels <= RELATIONSHIPS


@pytest.mark.anyio
async def test_unknown_label_rejected():
    builder = GraphBuilder()

    with pytest.raises(ValueError):
        await builder.upsert_node("Nope", "x", {})

    with pytest.raises(ValueError):
        await builder.create_relationship("Contract", "a", "SOMETHING", "Party", "b")
