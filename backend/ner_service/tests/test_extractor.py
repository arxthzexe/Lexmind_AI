from ner_service.extractor import EntityType, NerExtractor

SAMPLE = """
This agreement is between Party A (Acme Corporation) and Party B (Customer).
Effective Date: January 1, 2025. Payment of $1,000,000 due within 30 days.
Governing law of New York. Reference contract AB-2025-XYZ123.
"""


def test_ner_extracts_parties_dates_money():
    entities = NerExtractor().extract(SAMPLE)
    types = {e.type for e in entities}
    assert EntityType.party in types
    assert EntityType.date in types
    assert EntityType.money in types


def test_ner_extracts_jurisdiction_and_contract_id():
    entities = NerExtractor().extract(SAMPLE)
    types = {e.type for e in entities}
    assert EntityType.jurisdiction in types
    assert EntityType.contract_id in types


def test_ner_empty_text_no_entities():
    assert NerExtractor().extract("") == []
