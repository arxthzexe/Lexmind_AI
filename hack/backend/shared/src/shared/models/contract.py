from __future__ import annotations

from enum import StrEnum

from sqlalchemy import Column, Enum, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID

from shared.models.base import Base


class ContractStatus(StrEnum):
    draft = "draft"
    review = "review"
    approved = "approved"
    signed = "signed"
    active = "active"
    expired = "expired"
    archived = "archived"


class Contract(Base):
    __tablename__ = "contracts"

    title: str = Column(String(255), nullable=False)  # type: ignore
    status: ContractStatus = Column(  # type: ignore
        Enum(ContractStatus, name="contract_status"),
        nullable=False,
        default=ContractStatus.draft,
    )
    owner_id: str = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)  # type: ignore
    jurisdiction: str | None = Column(String(100), nullable=True)  # type: ignore
    version: str = Column(String(50), nullable=False, default="1.0")  # type: ignore
    file_key: str | None = Column(String(512), nullable=True)  # type: ignore
