# MentorBGITU — Backend

FastAPI + PostgreSQL + SQLAlchemy 2 + Alembic. Это общий каркас, на который Dev A и Dev B вешают свои роутеры.

## Структура

```
backend/
├── app/
│   ├── core/
│   │   ├── config.py        # настройки (pydantic-settings, .env)
│   │   └── security.py      # JWT + хэш паролей (bcrypt)
│   ├── db/
│   │   ├── base_class.py    # Base (id, created_at, updated_at)
│   │   ├── base.py          # импорт всех моделей для Alembic
│   │   └── session.py       # engine, SessionLocal, get_db
│   ├── models/
│   │   └── user.py          # минимальная модель User
│   ├── api/
│   │   ├── deps.py          # get_current_user, DbSession, CurrentUser
│   │   ├── router.py        # сюда подключаются роутеры команд
│   │   └── routes/          # сюда кладём auth.py, mentors.py, ...
│   └── main.py              # FastAPI app, CORS, /health
├── alembic/                 # миграции
├── docker-compose.yml       # api + postgres
├── Dockerfile
└── requirements.txt
```

## Запуск через Docker (рекомендуется)

```bash
cp .env.example .env        # поправь SECRET_KEY
docker compose up --build
```

API: http://localhost:8000 · Swagger: http://localhost:8000/docs · Health: http://localhost:8000/health

## Локально без Docker

```bash
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                                # POSTGRES_HOST=localhost, поднять postgres
alembic upgrade head
uvicorn app.main:app --reload
```

## Что уже готово (общая часть)

- Конфиг через `.env`, CORS под Vite (`localhost:5173`)
- Подключение к БД, `get_db`
- JWT-логин-флоу: `create_access_token`, `decode_token`, `hash_password`, `verify_password`
- `get_current_user` — готовая зависимость защиты эндпоинтов
- Модель `User` (минимальная, Dev A расширяет)
- Alembic настроен (autogenerate видит модели через `app/db/base.py`)
- `GET /health`

## Как добавлять свой код (Dev A / Dev B)

1. Модель → `app/models/`, затем добавить импорт в `app/db/base.py`.
2. Pydantic-схемы → `app/schemas/`.
3. Роуты → `app/api/routes/<имя>.py`, подключить в `app/api/router.py` (в файле есть подсказки-комментарии).
4. Миграция: `alembic revision --autogenerate -m "..."` → `alembic upgrade head`.
5. Защита эндпоинта: `current_user: CurrentUser` из `app.api.deps`.

## Готовые эндпоинты (Dev A)

Auth:
- `POST /api/auth/register` — {email, password, first_name?, last_name?} → токен
- `POST /api/auth/login` — form (username=email, password) → токен
- `GET  /api/auth/me` — текущий пользователь (Bearer)

Профиль (Bearer):
- `GET /api/profile/stats` — {active, completed, pending}
- `GET /api/profile/next-appointment` — ближайшая запись

Статистика и контент:
- `GET /api/stats/platform` — {mentors, directions, consultations}
- `GET /api/reviews` · `POST /api/reviews` (Bearer)
- `GET /api/resources` · `POST /api/resources` (Bearer)

## Демо-данные (seed)

После первого `docker compose up` (миграции применятся сами):

```bash
docker compose exec api python -m app.seed
```

Создаст менторов, отзывы, ресурсы и тестового юзера: **demo@bgitu.ru / demo123** с записями.

## Контракт между Dev A и Dev B

Статус `Booking` (Dev B) кормит статистику профиля (Dev A). Согласованные значения:
`active` (предстоит), `completed` (проведено), `pending` (ждёт подтверждения).
