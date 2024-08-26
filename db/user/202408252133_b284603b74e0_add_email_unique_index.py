"""add email unique index

Revision ID: b284603b74e0
Revises: 94376ab216fa
Create Date: 2024-08-25 21:33:56.828563

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b284603b74e0'
down_revision: Union[str, None] = '94376ab216fa'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = '94376ab216fa'

DB_SCHEMA = "our_story"
INDEX_NAME = "unique_idx_email"
TABLE = "user"

def upgrade() -> None:
    op.create_index(
        INDEX_NAME,
        TABLE,
        ["email"],
        schema=DB_SCHEMA,
        unique=True,
        if_not_exists=True
    )


def downgrade() -> None:
    op.drop_index(
        INDEX_NAME,
        TABLE,
        schema=DB_SCHEMA,
        if_exists=True
    )
