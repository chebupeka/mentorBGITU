from datetime import date

from sqlalchemy import Date, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base
from app.models.constants import BookingStatus


class Booking(Base):
    """Запись студента к наставнику.

    Создание/отмену владеет Dev B; статусы агрегирует Dev A (профиль, статистика).
    """

    __tablename__ = "bookings"

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    mentor_id: Mapped[int] = mapped_column(
        ForeignKey("mentors.id", ondelete="CASCADE"), index=True, nullable=False
    )
    scheduled_date: Mapped[date] = mapped_column(Date, nullable=False)
    scheduled_time: Mapped[str] = mapped_column(String(5), nullable=False)  # "18:00"
    format: Mapped[str] = mapped_column(String(80), default="Яндекс Телемост", nullable=False)
    comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(
        String(20), default=BookingStatus.PENDING, index=True, nullable=False
    )
