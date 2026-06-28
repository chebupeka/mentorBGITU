"""Наполнение БД демо-данными (идемпотентно — можно запускать многократно).

Запуск:
    docker compose exec api python -m app.seed
    # или локально:  python -m app.seed
"""
from datetime import date, timedelta

from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.booking import Booking
from app.models.constants import BookingStatus
from app.models.content import KnowledgeResource, Review
from app.models.mentor import Mentor
from app.models.slot import Slot
from app.models.user import User

# Исходные менторы (как в data/mentors.js)
MENTORS = [
    ("Сергей Бондаренко", "Frontend-разработчик", "React, JavaScript, TypeScript", "Frontend", ["React", "CSS", "Html"]),
    ("Максим Поленок", "Fullstack-разработчик", "React, JavaScript, Python, C++", "Backend", ["React", "CSS", "Html"]),
    ("Максим Исакович", "Fullstack-разработчик", "React, JavaScript, Python, C++", "Python", ["React", "CSS", "Html"]),
    ("Владислав Жинжиков", "Fullstack-разработчик", "React, JavaScript, Python, C++", "DevOps", ["React", "CSS", "Html"]),
]

REVIEWS = [
    ("Иванов Иван Иванович", "студент 3 курса БГИТУ",
     "Наставник помог разобраться с лабораторными по Frontend и подсказал, как оформить проект."),
    ("Петров Максим Андреевич", "студент 2 курса БГИТУ",
     "Благодаря наставнику понял основы алгоритмов и увереннее пишу на C++."),
    ("Смирнов Александр Сергеевич", "студент 4 курса БГИТУ",
     "Помог составить резюме и подготовиться к первой стажировке в IT."),
]

RESOURCES = [
    ("Сайт БГИТУ", "Официальный сайт университета.", "https://bgitu.ru", "paperclip", 1),
    ("Кафедра ИТ", "Информация о кафедре, преподавателях и программах.", "#", "flag", 2),
    ("Расписание", "Актуальное расписание занятий.", "#", "calendar", 3),
    ("Telegram", "Новости и материалы для студентов.", "#", "send", 4),
    ("Методические материалы", "Методички и рекомендации.", "#", "book", 5),
    ("IT-сообщество БГИТУ", "Новости и мероприятия.", "#", "airplay", 6),
]


def run() -> None:
    """Идемпотентный сид: догоняет недостающее, БД сносить не нужно."""
    db = SessionLocal()
    try:
        # --- Менторы (get-or-create по имени, поля синхронизируются) ---
        mentors = []
        for n, r, s, d, t in MENTORS:
            m = db.scalar(select(Mentor).where(Mentor.name == n))
            if m is None:
                m = Mentor(name=n, role=r, stack=s, direction=d, tags=t)
                db.add(m)
            else:
                m.role, m.stack, m.direction, m.tags = r, s, d, t
            mentors.append(m)
        db.flush()
        by_name = {m.name: m for m in mentors}
        sergey_mentor = by_name.get("Сергей Бондаренко", mentors[0])

        # --- Отзывы и ресурсы (только если пусто) ---
        if db.scalar(select(Review).limit(1)) is None:
            db.add_all(Review(author_name=n, author_sub=s, text=t) for n, s, t in REVIEWS)
        if db.scalar(select(KnowledgeResource).limit(1)) is None:
            db.add_all(
                KnowledgeResource(title=ti, description=de, url=u, icon=ic, order=o)
                for ti, de, u, ic, o in RESOURCES
            )

        # --- Студент (get-or-create по email) ---
        demo = db.scalar(select(User).where(User.email == "demo@bgitu.ru"))
        if demo is None:
            demo = User(
                email="demo@bgitu.ru",
                hashed_password=hash_password("demo123"),
                first_name="Леонид",
                last_name="Тарасов",
            )
            db.add(demo)
            db.flush()

        # --- Свободные слоты каждого ментора (только если слотов ещё нет) ---
        if db.scalar(select(Slot).limit(1)) is None:
            db.add_all(
                Slot(mentor_id=m.id, date=date.today() + timedelta(days=d), time=t)
                for m in mentors
                for d in (1, 2, 3, 5, 7)
                for t in ("16:00", "18:00")
            )

        # --- Тестовый аккаунт наставника: Сергей Бондаренко ---
        sergey = db.scalar(select(User).where(User.email == "sergey@bgitu.ru"))
        if sergey is None:
            sergey = User(
                email="sergey@bgitu.ru",
                hashed_password=hash_password("mentor123"),
                first_name="Сергей",
                last_name="Бондаренко",
                mentor_id=sergey_mentor.id,
            )
            db.add(sergey)
        elif sergey.mentor_id is None:
            sergey.mentor_id = sergey_mentor.id

        # --- Демо-записи студента (только если у него их ещё нет) ---
        # Одна рабочая запись к Сергею (видна в его кабинете) + косметические для статистики.
        has_bookings = db.scalar(
            select(Booking).where(Booking.user_id == demo.id).limit(1)
        )
        if has_bookings is None:
            polenok = by_name.get("Максим Поленок", mentors[1])
            isakovich = by_name.get("Максим Исакович", mentors[2])

            def booked_slot(mentor, days, time):
                slot = Slot(
                    mentor_id=mentor.id,
                    date=date.today() + timedelta(days=days),
                    time=time,
                    is_free=False,
                )
                db.add(slot)
                db.flush()
                return slot

            s_sergey = booked_slot(sergey_mentor, 2, "18:00")
            s_polenok = booked_slot(polenok, 4, "19:00")
            s_isakovich = booked_slot(isakovich, -3, "17:00")

            db.add_all([
                # Рабочая запись к Сергею — попадает в его кабинет (можно принять)
                Booking(
                    user_id=demo.id, mentor_id=sergey_mentor.id, slot_id=s_sergey.id,
                    scheduled_date=s_sergey.date, scheduled_time=s_sergey.time,
                    format="Яндекс Телемост",
                    comment="Хочу разобрать React-хуки и структуру проекта.",
                    status=BookingStatus.PENDING,
                ),
                # Косметические — для статистики студенческого кабинета
                Booking(
                    user_id=demo.id, mentor_id=polenok.id, slot_id=s_polenok.id,
                    scheduled_date=s_polenok.date, scheduled_time=s_polenok.time,
                    status=BookingStatus.ACTIVE,
                ),
                Booking(
                    user_id=demo.id, mentor_id=isakovich.id, slot_id=s_isakovich.id,
                    scheduled_date=s_isakovich.date, scheduled_time=s_isakovich.time,
                    status=BookingStatus.COMPLETED,
                ),
            ])

        db.commit()
        print("Сид выполнен.")
        print("  Студент:  demo@bgitu.ru / demo123")
        print("  Ментор:   sergey@bgitu.ru / mentor123")
    finally:
        db.close()


if __name__ == "__main__":
    run()
