from datetime import date

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class SlotCreate(BaseModel):
    date: date
    time: str = Field(pattern=r"^([01]\d|2[0-3]):[0-5]\d$", description="Время HH:MM")


class MentorBookingRead(BaseModel):
    """Заявка глазами наставника. Почта клиента видна для связи."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    date: date
    time: str
    format: str
    comment: str | None
    client_name: str
    client_email: EmailStr


class MentorStats(BaseModel):
    pending: int     # ожидают решения
    upcoming: int    # подтверждённые предстоящие
    completed: int   # проведённые
