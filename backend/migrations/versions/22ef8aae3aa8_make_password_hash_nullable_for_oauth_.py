"""make password_hash nullable for oauth users

Revision ID: 22ef8aae3aa8
Revises: 9989a8e6d158
Create Date: 2025-06-17 19:32:21.849290

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '22ef8aae3aa8'
down_revision = '9989a8e6d158'
branch_labels = None
depends_on = None


def upgrade():
    # Make password_hash nullable for OAuth users
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('password_hash',
                              existing_type=sa.String(256),
                              nullable=True)


def downgrade():
    # Revert to non-nullable (this might fail if OAuth users exist)
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.alter_column('password_hash',
                              existing_type=sa.String(256),
                              nullable=False)
