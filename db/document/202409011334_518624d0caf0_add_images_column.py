"""add images column

Revision ID: 518624d0caf0
Revises: 4480872671b5
Create Date: 2024-09-01 13:34:49.049712

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '518624d0caf0'
down_revision: Union[str, None] = '4480872671b5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = '4480872671b5'

DB_SCHEMA = "our_story"
TABLE = "document"
IMAGES_COLUMN = "images"

def upgrade() -> None:
    op.add_column(
        TABLE,
        sa.Column(IMAGES_COLUMN, sa.ARRAY(sa.Text)),
        schema=DB_SCHEMA
    )


def downgrade() -> None:
    op.drop_column(TABLE, IMAGES_COLUMN, schema=DB_SCHEMA)
