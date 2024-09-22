"""add eventDate column

Revision ID: 5b1179f3229a
Revises: 207da7f49849
Create Date: 2024-09-22 15:31:53.200519

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5b1179f3229a'
down_revision: Union[str, None] = '207da7f49849'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = '4480872671b5'

DB_SCHEMA = "our_story"
TABLE = "document"
COLUMN = "eventDate"

def upgrade() -> None:
    op.add_column(
        TABLE,
        sa.Column(COLUMN, sa.Date, server_default=sa.func.current_date()),
        schema=DB_SCHEMA
    )


def downgrade() -> None:
    op.drop_column(TABLE, COLUMN, schema=DB_SCHEMA)