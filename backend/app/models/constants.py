class BookingStatus:
    """Статусы записи. Контракт между Dev A (профиль/статистика) и Dev B (записи)."""

    ACTIVE = "active"        # предстоит, подтверждена
    PENDING = "pending"      # ждёт подтверждения наставником
    COMPLETED = "completed"  # проведена
    CANCELLED = "cancelled"  # отменена

    ALL = (ACTIVE, PENDING, COMPLETED, CANCELLED)
