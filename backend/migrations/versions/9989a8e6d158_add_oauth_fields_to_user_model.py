"""Add OAuth fields to User model

Revision ID: 9989a8e6d158
Revises: 8d30e311de91
Create Date: 2025-06-15 10:27:00.985598

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9989a8e6d158'
down_revision = '8d30e311de91'
branch_labels = None
depends_on = None


def upgrade():
    # Add OAuth fields to users table
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('oauth_provider', sa.String(length=50), nullable=True))
        batch_op.add_column(sa.Column('oauth_id', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('avatar_url', sa.String(length=255), nullable=True))


def downgrade():
    # Remove OAuth fields from users table
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('avatar_url')
        batch_op.drop_column('oauth_id')
        batch_op.drop_column('oauth_provider')