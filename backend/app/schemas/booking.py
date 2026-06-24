from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class BookingCreate(BaseModel):
    mentor_id: int
    slot_id: int
    format: str = Field(default="Яндекс Телемост", description="Формат и ссылка на встречу")
    comment: str | None = Field(default=None, description="Комментарий от студента (что хочется разобрать)")


class BookingRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    mentor_id: int
    slot_id: int
    format: str
    comment: str | None
    status: str
    created_at: datetime
    updated_at: datetime