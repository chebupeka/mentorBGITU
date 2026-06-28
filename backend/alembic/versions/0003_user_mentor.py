"""add users.mentor_id (link account to mentor card)

Revision ID: 0003
Revises: 0002
Create Date: 2026-06-28

"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0003"
down_revision: str | None = "0002"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column("users", sa.Column("mentor_id", sa.Integer(), nullable=True))
    op.create_index("ix_users_mentor_id", "users", ["mentor_id"])
    op.create_foreign_key(
        "fk_users_mentor_id", "users", "mentors",
        ["mentor_id"], ["id"], ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("fk_users_mentor_id", "users", type_="foreignkey")
    op.drop_index("ix_users_mentor_id", "users")
    op.drop_column("users", "mentor_id")
