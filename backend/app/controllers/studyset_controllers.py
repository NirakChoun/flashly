from app.models import StudySet, Flashcard
from app import db

def get_all_studysets(user_id):
    """Get all study sets for a user with flashcard counts"""
    try:
        studysets = StudySet.query.filter_by(user_id=user_id).all()
        result = []
        
        for studyset in studysets:
            studyset_dict = studyset.to_dict()
            # Add flashcard count
            flashcard_count = Flashcard.query.filter_by(studyset_id=studyset.id).count()
            studyset_dict['flashcard_count'] = flashcard_count
            result.append(studyset_dict)
            
        return result
    except Exception as e:
        raise e

def create_studyset(user_id, data):
    try:
        studyset = StudySet(
            user_id=user_id,
            title=data['title'],
            description=data.get('description', '')
        )
        db.session.add(studyset)
        db.session.commit()
        return studyset.to_dict()
    except Exception as e:
        db.session.rollback()
        raise e
    
def get_studyset_by_id(studyset_id):
    studyset = StudySet.query.get(studyset_id)
    return studyset.to_dict() if studyset else None

def update_studyset(studyset_id, data):
    try:
        studyset = StudySet.query.get(studyset_id)
        if not studyset:
            return None
        
        studyset.title = data.get('title', studyset.title)
        studyset.description = data.get('description', studyset.description)
        db.session.commit()
        return studyset.to_dict()
    except Exception as e:
        db.session.rollback()
        raise e
    
def delete_studyset(studyset_id):
    try:
        studyset = StudySet.query.get(studyset_id)
        if not studyset:
            return False
        
        db.session.delete(studyset)
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        raise e