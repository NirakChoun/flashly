import uuid
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
from .. import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    def __repr__(self):
        return f"<User {self.username}>"
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'username': self.username,
            'email': self.email,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
    
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