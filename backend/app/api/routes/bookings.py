from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.booking import Booking
from app.models.constants import BookingStatus
from app.models.slot import Slot
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingRead

router = APIRouter()


@router.post("/", response_model=BookingRead, status_code=status.HTTP_201_CREATED)
def create_booking(
        booking_in: BookingCreate,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Создание бронирования (Запись на консультацию)."""
    # 1. Проверяем, существует ли слот
    slot = db.get(Slot, booking_in.slot_id)
    if not slot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Указанный слот времени не найден.")

    # 2. Проверяем, свободен ли слот и принадлежит ли он именно этому ментору
    if not slot.is_free or slot.mentor_id != booking_in.mentor_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Этот слот уже занят или не принадлежит выбранному ментору."
        )

    # 3. Занимаем слот
    slot.is_free = False

    # 4. Создаем бронь. Дату/время копируем из слота (денормализация для
    #    профиля и статистики Dev A). Статус по умолчанию 'pending'.
    db_booking = Booking(
        user_id=current_user.id,
        mentor_id=booking_in.mentor_id,
        slot_id=booking_in.slot_id,
        scheduled_date=slot.date,
        scheduled_time=slot.time,
        format=booking_in.format,
        comment=booking_in.comment,
    )

    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking


@router.get("/my", response_model=list[BookingRead])
def get_my_bookings(
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Получение списка личных бронирований текущего студента."""
    query = select(Booking).where(Booking.user_id == current_user.id).order_by(Booking.created_at.desc())
    bookings = db.scalars(query).all()
    return bookings


@router.post("/{booking_id}/cancel", response_model=BookingRead)
def cancel_booking(
        booking_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    """Отмена бронирования студентом."""
    booking = db.get(Booking, booking_id)
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Бронирование не найдено.")

    # Проверяем, что отменить пытается именно тот студент, который бронировал
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Вы не можете отменить чужую запись.")

    # Нельзя отменить то, что уже завершено или отменено
    if booking.status in (BookingStatus.COMPLETED, BookingStatus.CANCELLED):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Нельзя отменить бронь со статусом '{booking.status}'."
        )

    # Меняем статус брони
    booking.status = BookingStatus.CANCELLED

    # ОСВОБОЖДАЕМ СЛОТ в расписании ментора, чтобы другие снова могли записаться!
    slot = db.get(Slot, booking.slot_id)
    if slot:
        slot.is_free = True

    db.commit()
    db.refresh(booking)
    return booking