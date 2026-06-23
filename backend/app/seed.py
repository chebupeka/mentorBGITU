"""Наполнение БД демо-данными.

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
from app.models.user import User

MENTORS = [
    ("Сергей Бондаренко", "Frontend-разработчик", "React, JavaScript, TypeScript", "Frontend", ["React", "CSS", "Html"]),
    ("Максим Поленок", "Fullstack-разработчик", "React, JavaScript, Python, C++", "Backend", ["Python", "FastAPI", "SQL"]),
    ("Максим Исакович", "Fullstack-разработчик", "React, JavaScript, Python, C++", "Python", ["Python", "Django"]),
    ("Владислав Жинжиков", "DevOps-инженер", "Docker, CI/CD, Linux", "DevOps", ["Docker", "CI/CD"]),
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
    db = SessionLocal()
    try:
        if db.scalar(select(Mentor).limit(1)) is not None:
            print("Данные уже есть, пропускаю сид.")
            return

        mentors = [
            Mentor(name=n, role=r, stack=s, direction=d, tags=t)
            for n, r, s, d, t in MENTORS
        ]
        db.add_all(mentors)

        db.add_all(
            Review(author_name=n, author_sub=s, text=t) for n, s, t in REVIEWS
        )
        db.add_all(
            KnowledgeResource(title=ti, description=de, url=u, icon=ic, order=o)
            for ti, de, u, ic, o in RESOURCES
        )

        demo = User(
            email="demo@bgitu.ru",
            hashed_password=hash_password("demo123"),
            first_name="Леонид",
            last_name="Тарасов",
        )
        db.add(demo)
        db.flush()  # получить id

        db.add_all([
            Booking(
                user_id=demo.id, mentor_id=mentors[0].id,
                scheduled_date=date.today() + timedelta(days=2),
                scheduled_time="18:00", format="Яндекс Телемост",
                status=BookingStatus.ACTIVE,
            ),
            Booking(
                user_id=demo.id, mentor_id=mentors[1].id,
                scheduled_date=date.today() + timedelta(days=5),
                scheduled_time="19:00", status=BookingStatus.PENDING,
            ),
            Booking(
                user_id=demo.id, mentor_id=mentors[0].id,
                scheduled_date=date.today() - timedelta(days=3),
                scheduled_time="17:00", status=BookingStatus.COMPLETED,
            ),
        ])
        db.commit()
        print("Сид выполнен. Демо-логин: demo@bgitu.ru / demo123")
    finally:
        db.close()


if __name__ == "__main__":
    run()
