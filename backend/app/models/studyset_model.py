import uuid
from datetime import datetime
from sqlalchemy.dialects.postgresql import UUID
from .. import db

class StudySet(db.Model):
    __tablename__ = 'studysets'

    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

    # Relationships
    # User → StudySets (one-to-many)
    user = db.relationship('User', backref='studysets')

    # Flashcard → StudySet (many-to-one) 
    flashcards = db.relationship('Flashcard', backref='studyset', cascade='all, delete-orphan')

    def __repr__(self):
        return f"<StudySet {self.title}>"
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'title': self.title,
            'description': self.description,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
        }