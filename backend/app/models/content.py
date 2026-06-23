from sqlalchemy import Boolean, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base_class import Base


class Review(Base):
    """Отзыв студента (блок «Отзывы» на главной)."""

    __tablename__ = "reviews"

    author_name: Mapped[str] = mapped_column(String(150), nullable=False)
    author_sub: Mapped[str] = mapped_column(String(150), default="", nullable=False)
    text: Mapped[str] = mapped_column(Text, nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class KnowledgeResource(Base):
    """Ссылка в «Базе знаний»."""

    __tablename__ = "knowledge_resources"

    title: Mapped[str] = mapped_column(String(150), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    url: Mapped[str] = mapped_column(String(500), default="#", nullable=False)
    icon: Mapped[str | None] = mapped_column(String(50), nullable=True)
    order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
