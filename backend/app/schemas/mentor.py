from pydantic import BaseModel, ConfigDict
from datetime import date
from pydantic import BaseModel, ConfigDict


class MentorRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    role: str
    stack: str
    direction: str
    tags: list[str]  # Наш JSON-список строк для фронта
    bio: str | None
    is_active: bool


class PaginatedMentors(BaseModel):
    items: list[MentorRead]
    total: int
    page: int
    size: int

class SlotRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    mentor_id: int
    date: date
    time: str
    is_free: bool