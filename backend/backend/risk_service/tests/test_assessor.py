from risk_service.assessor import RiskAssessor, RiskCategory, RiskSeverity

SAMPLE = """
The Supplier has unlimited liability for all losses.
The agreement includes a data protection clause and GDPR compliance.
Late payment incurs a penalty.
"""


def test_detects_legal_risk():
    risks = RiskAssessor().assess(SAMPLE)
    assert any(r.category == RiskCategory.legal for r in risks)


def test_detects_financial_and_compliance_risk():
    risks = RiskAssessor().assess(SAMPLE)
    assert any(r.category == RiskCategory.financial for r in risks)
    assert any(r.category == RiskCategory.compliance for r in risks)


def test_severity_mapped():
    risks = RiskAssessor().assess(SAMPLE)
    for r in risks:
        assert r.severity in RiskSeverity
