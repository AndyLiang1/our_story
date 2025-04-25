"""add colour field to user

Revision ID: 17268d4acd08
Revises: b284603b74e0
Create Date: 2025-04-24 21:11:28.874306

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '17268d4acd08'
down_revision: Union[str, None] = 'b284603b74e0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = '94376ab216fa'

DB_SCHEMA = "our_story"
TABLE = "user"
COLUMN_NAME = "colour"

def upgrade() -> None:
    op.add_column(
        table_name=TABLE,
        column=sa.Column(COLUMN_NAME, sa.Text),
        schema=DB_SCHEMA
    )


def downgrade() -> None:
    op.drop_column(
        table_name=TABLE,
        column_name=COLUMN_NAME,
        schema=DB_SCHEMA
    )
