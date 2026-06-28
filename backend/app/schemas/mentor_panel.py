from datetime import date

from pydantic import BaseModel, ConfigDict, EmailStr


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
