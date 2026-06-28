from sqlalchemy import Boolean, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base


class User(Base):
    """Пользователь. Если задан mentor_id — это аккаунт наставника."""

    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    last_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    # Если пользователь — наставник, ссылка на его карточку в mentors
    mentor_id: Mapped[int | None] = mapped_column(
        ForeignKey("mentors.id", ondelete="SET NULL"), nullable=True, index=True
    )
