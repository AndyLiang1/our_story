"""create partners branch

Revision ID: 5bb82a33b699
Revises: 
Create Date: 2025-03-20 20:04:27.026648

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5bb82a33b699'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = ('partners',)
depends_on: Union[str, Sequence[str], None] = None

DB_SCHEMA = "our_story"
TABLE = "partners"
INDEX_NAME = "unique_partners_idx"

def upgrade() -> None:
    op.create_table(
        TABLE,
        sa.Column(
            "userId1", 
            sa.Text,
            sa.ForeignKey(f'{DB_SCHEMA}.user.userId'),
            nullable=False,
        ),
        sa.Column(
            "userId2", 
            sa.Text,
            sa.ForeignKey(f'{DB_SCHEMA}.user.userId'),
            nullable=False,
        ),
        sa.Column(
            "createdAt", 
            sa.TIMESTAMP(timezone=False),
            server_default=sa.func.now()
        ),
        sa.Column(
            "updatedAt", 
            sa.TIMESTAMP(timezone=False),
        ),
        schema=DB_SCHEMA
    )

def downgrade() -> None:
    op.drop_table(TABLE, schema=DB_SCHEMA)
