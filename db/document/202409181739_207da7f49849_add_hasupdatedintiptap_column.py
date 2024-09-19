"""add hasUpdatedInTipTap column

Revision ID: 207da7f49849
Revises: 17958b38fc92
Create Date: 2024-09-18 17:39:42.845608

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '207da7f49849'
down_revision: Union[str, None] = '17958b38fc92'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = '4480872671b5'

DB_SCHEMA = "our_story"
TABLE = "document"
COLUMN = "hasUpdatedInTipTap"

def upgrade() -> None:
    op.add_column(
        TABLE,
        sa.Column(COLUMN, sa.Boolean, default=False),
        schema=DB_SCHEMA
    )


def downgrade() -> None:
    op.drop_column(TABLE, COLUMN, schema=DB_SCHEMA)