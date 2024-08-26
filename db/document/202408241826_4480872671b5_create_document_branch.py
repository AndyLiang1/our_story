"""create document branch

Revision ID: 4480872671b5
Revises: 
Create Date: 2024-08-24 18:26:37.922776

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4480872671b5'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = ('document',)
depends_on: Union[str, Sequence[str], None] = None

DB_SCHEMA = "our_story"
TABLE = "document"

def upgrade() -> None:
    op.create_table(
        TABLE,
        sa.Column(
            "documentId", 
            sa.Text, 
            primary_key=True,
            server_default=sa.text("concat('doc-', gen_random_uuid())"),
        ),
        sa.Column("title", sa.Text),
        sa.Column("content", sa.Text),
        sa.Column("owners", sa.ARRAY(sa.Text)),
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
