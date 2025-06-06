import uuid
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
from .. import db

class Flashcard(db.Model):
    __tablename__ = 'flashcards'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    studyset_id = db.Column(UUID(as_uuid=True), db.ForeignKey('studysets.id'), nullable=False)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    
    # Relationship
    user = db.relationship('User', backref='flashcards')

    def __repr__(self):
        return f"<Flashcard {self.id}: {self.question[:50]}...>"
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'question': self.question,
            'answer': self.answer,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }