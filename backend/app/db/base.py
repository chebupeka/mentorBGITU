# Импортирует Base и все модели в одном месте — нужно для Alembic autogenerate.
# Dev A / Dev B: добавляйте сюда импорт каждой новой модели.
from app.db.base_class import Base  # noqa: F401
from app.models.booking import Booking  # noqa: F401
from app.models.content import KnowledgeResource, Review  # noqa: F401
from app.models.mentor import Mentor  # noqa: F401
from app.models.user import User  # noqa: F401
