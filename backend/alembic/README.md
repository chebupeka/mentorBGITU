Миграции Alembic.

Создать миграцию по изменениям моделей:
    alembic revision --autogenerate -m "описание"

Применить:
    alembic upgrade head

Не забудьте добавить импорт новой модели в app/db/base.py, иначе autogenerate её не увидит.
