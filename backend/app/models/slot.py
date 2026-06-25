from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, Date, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from app.models.mentor import Mentor


class Slot(Base):
    """Слот времени в календаре ментора. Создаётся ментором, бронируется студентом."""

    __tablename__ = "slots"

    mentor_id: Mapped[int] = mapped_column(
        ForeignKey("mentors.id", ondelete="CASCADE"), index=True, nullable=False
    )
    date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    time: Mapped[str] = mapped_column(String(5), nullable=False)  # "14:30", "18:00"
    is_free: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False, index=True
    )

    mentor: Mapped["Mentor"] = relationship("Mentor", back_populates="slots")
