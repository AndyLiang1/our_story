"""add partners pk

Revision ID: a482428e55f9
Revises: 5bb82a33b699
Create Date: 2025-04-24 21:02:42.694181

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a482428e55f9'
down_revision: Union[str, None] = '5bb82a33b699'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = '5bb82a33b699'

DB_SCHEMA = "our_story"
CONSTRAINT_NAME = "partners_pkey"
TABLE_NAME = "partners"

def upgrade() -> None:
    op.create_primary_key(
        constraint_name=CONSTRAINT_NAME,
        table_name=TABLE_NAME,
        columns=["userId1", "userId2"],
        schema=DB_SCHEMA
    )


def downgrade() -> None:
    op.drop_constraint(
        constraint_name=CONSTRAINT_NAME,
        table_name=TABLE_NAME,
        schema=DB_SCHEMA
    )
