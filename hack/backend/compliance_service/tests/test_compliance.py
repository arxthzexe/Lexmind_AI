from compliance_service.engine import ComplianceEngine, ComplianceSeverity


def test_missing_required_clauses_flagged():
    checks = ComplianceEngine().validate("This agreement contains no privacy provisions at all.")
    violations = [c for c in checks if c.status == ComplianceSeverity.violation]
    assert any(c.policy == "Data Protection" for c in violations)


def test_present_clauses_ok():
    text = (
        "This agreement protects personal data under GDPR. "
        "Confidentiality obligations apply. Termination upon notice. "
        "Governing law of New York. Payment within 30 days."
    )
    checks = ComplianceEngine().validate(text)
    violations = [c for c in checks if c.status == ComplianceSeverity.violation]
    assert not any(c.policy == "Data Protection" for c in violations)
    assert len(violations) <= 1
