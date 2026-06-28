"""Наполнение БД демо-данными.

Запуск:
    docker compose exec api python -m app.seed
    # или локально:  python -m app.seed
"""
from datetime import date, timedelta

from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models.content import KnowledgeResource, Review
from app.models.mentor import Mentor
from app.models.slot import Slot
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

        # Свободные слоты в расписании каждого ментора — чтобы запись шла «вживую».
        # Никаких готовых заявок не создаём: они появятся, когда студент запишется.
        free_slots = [
            Slot(mentor_id=m.id, date=date.today() + timedelta(days=d), time=t)
            for m in mentors
            for d in (1, 2, 3, 5, 7)
            for t in ("16:00", "18:00")
        ]
        db.add_all(free_slots)

        # Аккаунт наставника: Сергей Бондаренко (mentors[0])
        sergey = User(
            email="sergey@bgitu.ru",
            hashed_password=hash_password("mentor123"),
            first_name="Сергей",
            last_name="Бондаренко",
            mentor_id=mentors[0].id,
        )
        db.add(sergey)

        db.commit()
        print("Сид выполнен.")
        print("  Студент:  demo@bgitu.ru / demo123")
        print("  Ментор:   sergey@bgitu.ru / mentor123")
    finally:
        db.close()


if __name__ == "__main__":
    run()
