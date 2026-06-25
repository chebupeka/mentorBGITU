"""add slots table and bookings.slot_id

Revision ID: 0002
Revises: 0001
Create Date: 2026-06-25

"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0002"
down_revision: str | None = "0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "slots",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("mentor_id", sa.Integer(), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("time", sa.String(5), nullable=False),
        sa.Column("is_free", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column(
            "created_at", sa.DateTime(timezone=True),
            server_default=sa.func.now(), nullable=False,
        ),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True),
            server_default=sa.func.now(), nullable=False,
        ),
        sa.ForeignKeyConstraint(["mentor_id"], ["mentors.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_slots_id", "slots", ["id"])
    op.create_index("ix_slots_mentor_id", "slots", ["mentor_id"])
    op.create_index("ix_slots_date", "slots", ["date"])
    op.create_index("ix_slots_is_free", "slots", ["is_free"])

    op.add_column("bookings", sa.Column("slot_id", sa.Integer(), nullable=True))
    op.create_index("ix_bookings_slot_id", "bookings", ["slot_id"])
    op.create_foreign_key(
        "fk_bookings_slot_id", "bookings", "slots",
        ["slot_id"], ["id"], ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("fk_bookings_slot_id", "bookings", type_="foreignkey")
    op.drop_index("ix_bookings_slot_id", "bookings")
    op.drop_column("bookings", "slot_id")
    op.drop_table("slots")
