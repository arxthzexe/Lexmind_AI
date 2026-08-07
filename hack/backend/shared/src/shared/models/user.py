from sqlalchemy import Boolean, Column, String

from shared.models.base import Base


class User(Base):
    __tablename__ = "users"

    email: str = Column(String(255), nullable=False, unique=True)  # type: ignore
    full_name: str = Column(String(255), nullable=False)  # type: ignore
    role: str = Column(String(50), nullable=False)  # type: ignore
    hashed_password: str = Column(String(255), nullable=False)  # type: ignore
    is_active: bool = Column(Boolean, server_default="true", nullable=False)  # type: ignore
