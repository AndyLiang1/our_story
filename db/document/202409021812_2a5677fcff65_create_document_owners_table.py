"""create documentOwners table

Revision ID: 2a5677fcff65
Revises: 518624d0caf0
Create Date: 2024-09-02 18:12:10.257839

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2a5677fcff65'
down_revision: Union[str, None] = '518624d0caf0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = ['4480872671b5', '94376ab216fa']

DB_SCHEMA = "our_story"
TABLE = "documentOwners"
DOCUMENT_TABLE = "document"
USER_TABLE = "user"

DOCUMENT_ID_FK_NAME = 'fk_document_id'
USER_ID_FK_NAME = 'fk_user_id'

DOCUMENT_ID_COL = "documentId"
USER_ID_COL = "userId"

def upgrade() -> None:
    op.create_table(
        TABLE,
        sa.Column(
            DOCUMENT_ID_COL,
            sa.Text,
            primary_key=True,
            nullable=False
        ),
        sa.Column(
            "userId",
            sa.Text,
            primary_key=True,
            nullable=False
        ),
        schema=DB_SCHEMA
    )
    op.create_foreign_key(
        DOCUMENT_ID_FK_NAME,
        source_table=TABLE,
        referent_table=DOCUMENT_TABLE,
        local_cols=[DOCUMENT_ID_COL],
        remote_cols=[DOCUMENT_ID_COL],
        source_schema=DB_SCHEMA,
        referent_schema=DB_SCHEMA,
        ondelete='CASCADE'
    )
    op.create_foreign_key(
        USER_ID_FK_NAME,
        source_table=TABLE,
        referent_table=USER_TABLE,
        local_cols=[USER_ID_COL],
        remote_cols=[USER_ID_COL],
        source_schema=DB_SCHEMA,
        referent_schema=DB_SCHEMA,
        ondelete='CASCADE'
    )
    op.drop_column(
        DOCUMENT_TABLE,
        column_name="owners",
        schema=DB_SCHEMA
    )


def downgrade() -> None:
    op.add_column(
        DOCUMENT_TABLE,
        sa.Column("owners", sa.ARRAY(sa.Text)),
        schema=DB_SCHEMA
    )
    op.drop_table(
        TABLE,
        schema=DB_SCHEMA
    )
