from datetime import date

from fastapi import APIRouter, HTTPException, status
from sqlalchemy import func, select

from app.api.deps import CurrentUser, DbSession
from app.models.booking import Booking
from app.models.constants import BookingStatus
from app.models.mentor import Mentor
from app.schemas.profile import NextAppointment, ProfileStats

router = APIRouter()


@router.get("/stats", response_model=ProfileStats)
def my_stats(current_user: CurrentUser, db: DbSession):
    rows = db.execute(
        select(Booking.status, func.count())
        .where(Booking.user_id == current_user.id)
        .group_by(Booking.status)
    ).all()
    counts = {status_: cnt for status_, cnt in rows}
    return ProfileStats(
        active=counts.get(BookingStatus.ACTIVE, 0),
        completed=counts.get(BookingStatus.COMPLETED, 0),
        pending=counts.get(BookingStatus.PENDING, 0),
    )


@router.get("/next-appointment", response_model=NextAppointment)
def next_appointment(current_user: CurrentUser, db: DbSession):
    row = db.execute(
        select(Booking, Mentor)
        .join(Mentor, Mentor.id == Booking.mentor_id)
        .where(
            Booking.user_id == current_user.id,
            Booking.status.in_([BookingStatus.ACTIVE, BookingStatus.PENDING]),
            Booking.scheduled_date >= date.today(),
        )
        .order_by(Booking.scheduled_date.asc(), Booking.scheduled_time.asc())
        .limit(1)
    ).first()

    if row is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Нет предстоящих записей",
        )

    booking, mentor = row
    return NextAppointment(
        mentor_name=mentor.name,
        mentor_direction=mentor.direction,
        date=booking.scheduled_date,
        time=booking.scheduled_time,
        format=booking.format,
    )
