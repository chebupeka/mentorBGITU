from datetime import datetime
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.mentor import Mentor

class Slot(Base):
    __tablename__ = "slots"

    mentor_id: Mapped[int] = mapped_column(ForeignKey("mentors.id", ondelete="CASCADE"))
    start_time: Mapped[datetime] = mapped_column(nullable=False)
    is_booked: Mapped[bool] = mapped_column(default=False)

    # Связь с наставником
    mentor: Mapped["Mentor"] = relationship(back_populates="slots")