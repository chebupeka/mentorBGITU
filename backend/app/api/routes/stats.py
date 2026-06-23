from fastapi import APIRouter
from sqlalchemy import func, select

from app.api.deps import DbSession
from app.models.booking import Booking
from app.models.constants import BookingStatus
from app.models.mentor import Mentor
from app.schemas.stats import PlatformStats

router = APIRouter()


@router.get("/platform", response_model=PlatformStats)
def platform_stats(db: DbSession):
    mentors = db.scalar(
        select(func.count()).select_from(Mentor).where(Mentor.is_active.is_(True))
    )
    directions = db.scalar(
        select(func.count(func.distinct(Mentor.direction))).where(
            Mentor.is_active.is_(True)
        )
    )
    consultations = db.scalar(
        select(func.count())
        .select_from(Booking)
        .where(Booking.status == BookingStatus.COMPLETED)
    )
    return PlatformStats(
        mentors=mentors or 0,
        directions=directions or 0,
        consultations=consultations or 0,
    )
