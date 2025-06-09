from app.models import StudySet
from app import db

def get_all_studysets(user_id):
    studysets = StudySet.query.filter_by(user_id=user_id).all()
    return [s.to_dict() for s in studysets]

def create_studyset(data):
    try:
        studyset = StudySet(
            user_id=data['user_id'],
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