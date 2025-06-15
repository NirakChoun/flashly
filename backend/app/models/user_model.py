import uuid
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
from .. import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=True)  # Allow null for OAuth users
    
    # OAuth-related fields
    oauth_provider = db.Column(db.String(50), nullable=True)  # 'google', 'github', etc.
    oauth_id = db.Column(db.String(100), nullable=True)  # Provider's user ID
    avatar_url = db.Column(db.String(255), nullable=True)
    
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    def __repr__(self):
        return f"<User {self.username}>"
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'username': self.username,
            'email': self.email,
            'oauth_provider': self.oauth_provider,
            'avatar_url': self.avatar_url,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
    def is_oauth_user(self):
        """Check if user signed up via OAuth"""
        return self.oauth_provider is not None
    
    def has_password(self):
        """Check if user has a password (not OAuth-only)"""
        return self.password_hash is not None
    
    def get_flashcard_stats(self):
        """Get user's flashcard statistics"""
        from .flashcard_model import Flashcard
        
        total_cards = Flashcard.query.filter_by(user_id=self.id).count()
        ai_generated = Flashcard.query.filter_by(user_id=self.id, is_ai_generated=True).count()
        manual_cards = total_cards - ai_generated
        
        return {
            'total_flashcards': total_cards,
            'ai_generated': ai_generated,
            'manual_cards': manual_cards
        }