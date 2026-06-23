"""initial schema: users, mentors, bookings, reviews, knowledge_resources

Revision ID: 0001
Revises:
Create Date: 2026-06-23

"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def _timestamps() -> list[sa.Column]:
    return [
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    ]


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("first_name", sa.String(100), nullable=True),
        sa.Column("last_name", sa.String(100), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        *_timestamps(),
    )
    op.create_index("ix_users_id", "users", ["id"])
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "mentors",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(150), nullable=False),
        sa.Column("role", sa.String(150), nullable=False),
        sa.Column("stack", sa.String(255), nullable=False, server_default=""),
        sa.Column("direction", sa.String(80), nullable=False),
        sa.Column("tags", sa.JSON(), nullable=False),
        sa.Column("bio", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        *_timestamps(),
    )
    op.create_index("ix_mentors_id", "mentors", ["id"])
    op.create_index("ix_mentors_direction", "mentors", ["direction"])

    op.create_table(
        "bookings",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("mentor_id", sa.Integer(), nullable=False),
        sa.Column("scheduled_date", sa.Date(), nullable=False),
        sa.Column("scheduled_time", sa.String(5), nullable=False),
        sa.Column(
            "format", sa.String(80), nullable=False, server_default="Яндекс Телемост"
        ),
        sa.Column("comment", sa.Text(), nullable=True),
        sa.Column(
            "status", sa.String(20), nullable=False, server_default="pending"
        ),
        *_timestamps(),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["mentor_id"], ["mentors.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_bookings_id", "bookings", ["id"])
    op.create_index("ix_bookings_user_id", "bookings", ["user_id"])
    op.create_index("ix_bookings_mentor_id", "bookings", ["mentor_id"])
    op.create_index("ix_bookings_status", "bookings", ["status"])

    op.create_table(
        "reviews",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("author_name", sa.String(150), nullable=False),
        sa.Column("author_sub", sa.String(150), nullable=False, server_default=""),
        sa.Column("text", sa.Text(), nullable=False),
        sa.Column(
            "is_published", sa.Boolean(), nullable=False, server_default=sa.true()
        ),
        *_timestamps(),
    )
    op.create_index("ix_reviews_id", "reviews", ["id"])

    op.create_table(
        "knowledge_resources",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(150), nullable=False),
        sa.Column("description", sa.Text(), nullable=False, server_default=""),
        sa.Column("url", sa.String(500), nullable=False, server_default="#"),
        sa.Column("icon", sa.String(50), nullable=True),
        sa.Column("order", sa.Integer(), nullable=False, server_default="0"),
        *_timestamps(),
    )
    op.create_index("ix_knowledge_resources_id", "knowledge_resources", ["id"])


def downgrade() -> None:
    op.drop_table("knowledge_resources")
    op.drop_table("reviews")
    op.drop_table("bookings")
    op.drop_table("mentors")
    op.drop_table("users")
