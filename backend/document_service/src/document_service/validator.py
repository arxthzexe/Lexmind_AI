from __future__ import annotations

import hashlib
import mimetypes
from dataclasses import dataclass
from typing import ClassVar

from pydantic import BaseModel
from shared.pipeline.types import DocumentType

try:
    import magic  # type: ignore

    _HAS_MAGIC = True
except Exception:
    _HAS_MAGIC = False


SUPPORTED_MIME = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/jpeg",
    "image/tiff",
}

MAX_BYTES = 50 * 1024 * 1024  # 50 MB

# Pure-python magic-byte sniffing fallback (no native libmagic dependency)
_MAGIC_BYTES = {
    b"%PDF": "application/pdf",
    b"\x89PNG\r\n\x1a\n": "image/png",
    b"\xff\xd8\xff": "image/jpeg",
    b"II*\x00": "image/tiff",
    b"MM\x00*": "image/tiff",
    b"PK\x03\x04": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}


def sniff_mime(raw: bytes) -> str:
    if _HAS_MAGIC:
        try:
            return magic.from_buffer(raw, mime=True)  # type: ignore
        except Exception:
            pass
    for sig, mime in _MAGIC_BYTES.items():
        if raw.startswith(sig):
            return mime
    guessed, _ = mimetypes.guess_type("file.bin")
    return guessed or "application/octet-stream"


@dataclass
class ValidatedFile:
    filename: str
    mime: str
    sha256: str
    document_type: DocumentType


class ValidationResult(BaseModel):
    valid: bool
    mime: str | None = None
    sha256: str | None = None
    document_type: DocumentType | None = None
    error: str | None = None


class FileValidator:
    def validate(self, raw: bytes, filename: str) -> ValidationResult:
        if not raw:
            return ValidationResult(valid=False, error="Empty file")
        if len(raw) > MAX_BYTES:
            return ValidationResult(valid=False, error="File exceeds maximum size")
        mime = sniff_mime(raw)
        if mime not in SUPPORTED_MIME:
            return ValidationResult(valid=False, error=f"Unsupported mime: {mime}")
        sha = hashlib.sha256(raw).hexdigest()
        return ValidationResult(valid=True, mime=mime, sha256=sha)


class DocumentClassifier:
    """Rule-based document classification baseline.

    Maps filename keywords / content hints to the DocumentType taxonomy from
    05 §Clause Segmentation. A fine-tuned classifier can replace this.
    """

    _MAP: ClassVar[list[tuple[tuple[str, ...], DocumentType]]] = [
        (("nda", "confidentiality"), DocumentType.nda),
        (("service", "services"), DocumentType.service),
        (("supply", "distribution"), DocumentType.supply),
        (("employment", "employee"), DocumentType.employment),
        (("lease", "rental"), DocumentType.lease),
    ]

    def classify(self, filename: str, text: str) -> DocumentType:
        haystack = f"{filename} {text[:2000]}".lower()
        for keywords, doc_type in self._MAP:
            if any(kw in haystack for kw in keywords):
                return doc_type
        return DocumentType.other
