from document_service.validator import DocumentClassifier, FileValidator
from shared.pipeline.types import DocumentType


def test_validate_accepts_pdf():
    v = FileValidator()
    res = v.validate(b"%PDF-1.4 fake pdf", "nda.pdf")
    assert res.valid
    assert res.mime.startswith("application")


def test_validate_rejects_empty():
    v = FileValidator()
    res = v.validate(b"", "empty.pdf")
    assert not res.valid


def test_validate_rejects_oversized():
    from document_service.validator import MAX_BYTES

    v = FileValidator()
    res = v.validate(b"\x00" * (MAX_BYTES + 1), "big.pdf")
    assert not res.valid


def test_validate_rejects_unsupported():
    v = FileValidator()
    res = v.validate(b"not a real file content", "notes.txt")
    assert not res.valid


def test_classifier_detects_nda():
    classifier = DocumentClassifier()
    result = classifier.classify("mutual_nda.pdf", "This is a confidentiality agreement")
    assert result == DocumentType.nda


def test_classifier_default_other():
    classifier = DocumentClassifier()
    assert classifier.classify("mystery.docx", "some text") == DocumentType.other
