from sqlalchemy import JSON, Boolean, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from datetime import date
from sqlalchemy import Boolean, Date, ForeignKey, String
from sqlalchemy.orm import relationship


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

class Slot(Base):
    """Слот времени в календаре ментора. Создается ментором, бронируется студентом."""

    __tablename__ = "slots"

    mentor_id: Mapped[int] = mapped_column(
        ForeignKey("mentors.id", ondelete="CASCADE"), index=True, nullable=False
    )
    date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    time: Mapped[str] = mapped_column(String(5), nullable=False)  # "14:30", "18:00"
    is_free: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False, index=True)

    # Обратная связь
    mentor: Mapped["Mentor"] = relationship("Mentor", back_populates="slots")