from datetime import date

from pydantic import BaseModel


class ProfileStats(BaseModel):
    active: int       # активные записи
    completed: int    # завершённые консультации
    pending: int      # ожидают подтверждения


class NextAppointment(BaseModel):
    mentor_name: str
    mentor_direction: str
    date: date
    time: str
    format: str
