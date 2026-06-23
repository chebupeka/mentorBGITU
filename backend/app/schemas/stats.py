from pydantic import BaseModel


class PlatformStats(BaseModel):
    mentors: int        # наставников на платформе
    directions: int     # доступных направлений
    consultations: int  # проведённых консультаций
