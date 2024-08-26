"""create user branch

Revision ID: 94376ab216fa
Revises: 
Create Date: 2024-08-24 18:06:25.159973

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '94376ab216fa'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = ('user',)
depends_on: Union[str, Sequence[str], None] = None

DB_SCHEMA = "our_story"
TABLE = "user"

def upgrade() -> None:
    op.create_table(
        TABLE,
        sa.Column(
            "userId", 
            sa.Text, 
            primary_key=True,
            server_default=sa.text("concat('user-', gen_random_uuid())"),
        ),
        sa.Column("cognitoId", sa.Text, nullable=False),
        sa.Column("email", sa.Text, nullable=False),
        sa.Column("firstName", sa.Text),
        sa.Column("lastName", sa.Text),
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
