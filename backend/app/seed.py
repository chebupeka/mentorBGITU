"""Наполнение БД демо-данными (идемпотентно — можно запускать многократно).

Запуск:
    docker compose exec api python -m app.seed
    # или локально:  python -m app.seed

Никаких готовых записей не создаётся: любой пользователь записывается к ментору
сам через интерфейс, и заявка попадает в кабинет наставника.
"""
from datetime import date, timedelta

from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import SessionLocal
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

# (title, description, url, icon, order)
RESOURCES = [
    ("Сайт БГИТУ", "Официальный сайт Брянского государственного инженерно-технологического университета.",
     "https://bgitu.ru", "paperclip", 1),
    ("Кафедра ИТ", "Информация о кафедре информационных технологий, преподавателях и программах.",
     "https://it.bgitu.ru/", "flag", 2),
    ("Расписание", "Актуальное расписание занятий для всех курсов и направлений.",
     "https://it.bgitu.ru/", "calendar", 3),
    ("Telegram", "Актуальные новости, объявления и полезные материалы для студентов БГИТУ.",
     "#", "send", 4),
    ("Методические материалы", "Полезные методички, рекомендации и материалы для подготовки к занятиям.",
     "https://vk.com/bgitu_ru", "book", 5),
    ("IT-сообщество БГИТУ", "Новости, мероприятия и возможности для студентов и выпускников.",
     "https://vk.com/it_bgitu", "airplay", 6),
]


def run() -> None:
    """Идемпотентный сид: догоняет и обновляет данные, БД сносить не нужно."""
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

        # --- Отзывы (только если пусто) ---
        if db.scalar(select(Review).limit(1)) is None:
            db.add_all(Review(author_name=n, author_sub=s, text=t) for n, s, t in REVIEWS)

        # --- Ресурсы базы знаний (get-or-create по title, ссылки синхронизируются) ---
        for ti, de, u, ic, o in RESOURCES:
            res = db.scalar(select(KnowledgeResource).where(KnowledgeResource.title == ti))
            if res is None:
                db.add(KnowledgeResource(title=ti, description=de, url=u, icon=ic, order=o))
            else:
                res.description, res.url, res.icon, res.order = de, u, ic, o

        # --- Тестовый студент (get-or-create по email), без записей ---
        demo = db.scalar(select(User).where(User.email == "demo@bgitu.ru"))
        if demo is None:
            demo = User(
                email="demo@bgitu.ru",
                hashed_password=hash_password("demo123"),
                first_name="Леонид",
                last_name="Тарасов",
            )
            db.add(demo)

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

        db.commit()
        print("Сид выполнен.")
        print("  Студент:  demo@bgitu.ru / demo123")
        print("  Ментор:   sergey@bgitu.ru / mentor123")
    finally:
        db.close()


if __name__ == "__main__":
    run()
