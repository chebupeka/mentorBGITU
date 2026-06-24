from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.mentor import Mentor, Slot  # Импортируем модель Slot для расписания
from app.schemas.mentor import PaginatedMentors, MentorRead, SlotRead  # Добавили MentorRead и SlotRead

router = APIRouter()


@router.get("/", response_model=PaginatedMentors)
def get_mentors(
        db: Session = Depends(get_db),
        page: int = Query(default=1, ge=1),
        size: int = Query(default=10, ge=1, le=100),
        search: str | None = Query(default=None, description="Поиск по имени, роли или стеку"),
        direction: str | None = Query(default=None, description="Фильтр по направлению (например, 'Программирование')"),
):
    """Получение списка активных менторов с пагинацией, поиском и фильтрацией."""
    # Выбираем только тех, кто активно преподает
    query = select(Mentor).where(Mentor.is_active == True)

    # 1. Фильтрация по направлению (прямое сравнение строк)
    if direction:
        query = query.where(Mentor.direction == direction)

    # 2. Регистронезависимый поиск по ключевым текстовым полям
    if search:
        search_filter = f"%{search}%"
        query = query.where(
            Mentor.name.ilike(search_filter) |
            Mentor.role.ilike(search_filter) |
            Mentor.stack.ilike(search_filter)
        )

    # 3. Подсчет общего количества для корректной пагинации на фронте
    total = db.scalar(select(func.count()).select_from(query.subquery()))

    # 4. Сама пагинация
    offset = (page - 1) * size
    query = query.offset(offset).limit(size)

    mentors = db.scalars(query).all()

    return {
        "items": mentors,
        "total": total,
        "page": page,
        "size": size,
    }


@router.get("/{mentor_id}", response_model=MentorRead)
def get_mentor_by_id(mentor_id: int, db: Session = Depends(get_db)):
    """Получение детальной карточки ментора."""
    mentor = db.get(Mentor, mentor_id)
    if not mentor or not mentor.is_active:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ментор не найден")
    return mentor


@router.get("/{mentor_id}/slots", response_model=list[SlotRead])
def get_mentor_slots(
        mentor_id: int,
        db: Session = Depends(get_db),
        only_free: bool = Query(default=True, description="Показывать только свободные слоты для записи")
):
    """Получение сетки расписания (слотов) конкретного наставника."""
    # Проверяем, существует ли активный ментор
    mentor = db.get(Mentor, mentor_id)
    if not mentor or not mentor.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ментор не найден или временно не принимает записи"
        )

    # Строим запрос к слотам этого ментора
    query = select(Slot).where(Slot.mentor_id == mentor_id)

    if only_free:
        query = query.where(Slot.is_free == True)

    # Сортируем от ближайших дат к дальним
    query = query.order_by(Slot.date.asc(), Slot.time.asc())

    slots = db.scalars(query).all()
    return slots