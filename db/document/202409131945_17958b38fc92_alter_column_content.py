"""alter column content

Revision ID: 17958b38fc92
Revises: eb57070491ec
Create Date: 2024-09-13 19:45:07.675424

"""
from typing import Sequence, Union

from alembic import op
from sqlalchemy.dialects.postgresql import JSONB
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '17958b38fc92'
down_revision: Union[str, None] = 'eb57070491ec'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = '4480872671b5'

DB_SCHEMA = "our_story"
TABLE = "document"

OLD_CONTENT_COLUMN_NAME = "content"
NEW_CONTENT_COLUMN_NAME = "documentContent"

def upgrade() -> None:
    op.alter_column(
        TABLE,
        OLD_CONTENT_COLUMN_NAME,
        new_column_name=NEW_CONTENT_COLUMN_NAME,
        existing_type=sa.TEXT,
        type_=JSONB,
        postgresql_using=f"{OLD_CONTENT_COLUMN_NAME}::jsonb",
        schema=DB_SCHEMA,
    )
    
def downgrade() -> None:
    op.alter_column(
        TABLE,
        NEW_CONTENT_COLUMN_NAME,
        new_column_name=OLD_CONTENT_COLUMN_NAME,
        existing_type=JSONB,
        type_=sa.TEXT,
        postgresql_using=f"{NEW_CONTENT_COLUMN_NAME}::text",
        schema=DB_SCHEMA
    )