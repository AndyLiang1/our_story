"""add createdByUserId column to document

Revision ID: eb57070491ec
Revises: 2a5677fcff65
Create Date: 2024-09-02 18:29:56.419537

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'eb57070491ec'
down_revision: Union[str, None] = '2a5677fcff65'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = '4480872671b5'

DB_SCHEMA = "our_story"
TABLE = "document"
CREATED_BY_USER_ID_COLUMN = "createdByUserId"
USER_ID_FK_NAME = 'fk_user_id'
USER_TABLE = "user"
USER_ID_COL = "userId"

def upgrade() -> None:
    op.add_column(
        TABLE,
        sa.Column(
            CREATED_BY_USER_ID_COLUMN, 
            sa.Text,
            nullable=False
        ),
        schema=DB_SCHEMA
    )
    op.create_foreign_key(
        USER_ID_FK_NAME,
        source_table=TABLE,
        referent_table=USER_TABLE,
        local_cols=[CREATED_BY_USER_ID_COLUMN],
        remote_cols=[USER_ID_COL],
        source_schema=DB_SCHEMA,
        referent_schema=DB_SCHEMA,
        ondelete='CASCADE'
    )

def downgrade() -> None:
    op.drop_column(TABLE, CREATED_BY_USER_ID_COLUMN, schema=DB_SCHEMA)
