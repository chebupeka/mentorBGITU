from typing import TYPE_CHECKING

from sqlalchemy import JSON, Boolean, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from app.models.slot import Slot


class Mentor(Base):
    """Наставник. Роуты/логику владеет Dev B, модель общая."""

    __tablename__ = "mentors"

    name: Mapped[str] = mapped_column(String(150), nullable=False)
    role: Mapped[str] = mapped_column(String(150), nullable=False)
    stack: Mapped[str] = mapped_column(String(255), default="", nullable=False)
    direction: Mapped[str] = mapped_column(String(80), index=True, nullable=False)
    tags: Mapped[list] = mapped_column(JSON, default=list, nullable=False)
    bio: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    slots: Mapped[list["Slot"]] = relationship(
        "Slot", back_populates="mentor", cascade="all, delete-orphan"
    )
