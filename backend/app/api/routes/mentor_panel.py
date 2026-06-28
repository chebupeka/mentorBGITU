"""Кабинет наставника: входящие заявки, принятие/отклонение, почта клиента."""
from fastapi import APIRouter, HTTPException, status
from sqlalchemy import func, select

from app.api.deps import CurrentUser, DbSession
from app.models.booking import Booking
from app.models.constants import BookingStatus
from app.models.slot import Slot
from app.models.user import User
from app.schemas.mentor_panel import MentorBookingRead, MentorStats

router = APIRouter()


def _ensure_mentor(user: User) -> int:
    if not user.mentor_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Доступно только наставникам",
        )
    return user.mentor_id


def _to_read(booking: Booking, client: User) -> MentorBookingRead:
    return MentorBookingRead(
        id=booking.id,
        status=booking.status,
        date=booking.scheduled_date,
        time=booking.scheduled_time,
        format=booking.format,
        comment=booking.comment,
        client_name=" ".join(
            p for p in [client.first_name, client.last_name] if p
        ) or client.email,
        client_email=client.email,
    )


@router.get("/stats", response_model=MentorStats)
def mentor_stats(current_user: CurrentUser, db: DbSession):
    mentor_id = _ensure_mentor(current_user)
    rows = db.execute(
        select(Booking.status, func.count())
        .where(Booking.mentor_id == mentor_id)
        .group_by(Booking.status)
    ).all()
    c = {s: n for s, n in rows}
    return MentorStats(
        pending=c.get(BookingStatus.PENDING, 0),
        upcoming=c.get(BookingStatus.ACTIVE, 0),
        completed=c.get(BookingStatus.COMPLETED, 0),
    )


@router.get("/bookings", response_model=list[MentorBookingRead])
def mentor_bookings(current_user: CurrentUser, db: DbSession):
    mentor_id = _ensure_mentor(current_user)
    rows = db.execute(
        select(Booking, User)
        .join(User, User.id == Booking.user_id)
        .where(Booking.mentor_id == mentor_id)
        .order_by(Booking.scheduled_date.asc(), Booking.scheduled_time.asc())
    ).all()
    return [_to_read(b, u) for b, u in rows]


def _get_owned_booking(db, mentor_id: int, booking_id: int) -> Booking:
    booking = db.get(Booking, booking_id)
    if not booking or booking.mentor_id != mentor_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Заявка не найдена"
        )
    return booking


@router.post("/bookings/{booking_id}/accept", response_model=MentorBookingRead)
def accept_booking(booking_id: int, current_user: CurrentUser, db: DbSession):
    mentor_id = _ensure_mentor(current_user)
    booking = _get_owned_booking(db, mentor_id, booking_id)
    if booking.status != BookingStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Заявку нельзя принять из статуса '{booking.status}'",
        )
    booking.status = BookingStatus.ACTIVE
    db.commit()
    db.refresh(booking)
    client = db.get(User, booking.user_id)
    return _to_read(booking, client)


@router.post("/bookings/{booking_id}/decline", response_model=MentorBookingRead)
def decline_booking(booking_id: int, current_user: CurrentUser, db: DbSession):
    mentor_id = _ensure_mentor(current_user)
    booking = _get_owned_booking(db, mentor_id, booking_id)
    if booking.status in (BookingStatus.COMPLETED, BookingStatus.CANCELLED):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Заявку нельзя отклонить из статуса '{booking.status}'",
        )
    booking.status = BookingStatus.CANCELLED
    # освобождаем слот
    if booking.slot_id:
        slot = db.get(Slot, booking.slot_id)
        if slot:
            slot.is_free = True
    db.commit()
    db.refresh(booking)
    client = db.get(User, booking.user_id)
    return _to_read(booking, client)
