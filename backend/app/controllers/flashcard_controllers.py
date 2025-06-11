from app.models.flashcard_model import Flashcard
from app import db
from utils.flashly_bot import FlashlyBot

def get_flashcards_by_studyset(studyset_id):
    """Get all flashcards for a specific study set"""
    flashcards = Flashcard.query.filter_by(studyset_id=studyset_id).all()
    return [f.to_dict() for f in flashcards]

def create_flashcards(studyset_id, user_id, flashcards_data):
    """Create multiple flashcards for an existing study set"""
    try:
        flashcards = []
        for card_data in flashcards_data:
            flashcard = Flashcard(
                user_id=user_id,
                studyset_id=studyset_id,
                question=card_data['question'],
                answer=card_data['answer']
            )
            flashcards.append(flashcard)
            db.session.add(flashcard)
        
        db.session.commit()
        return [f.to_dict() for f in flashcards]
        
    except Exception as e:
        db.session.rollback()
        raise e

def preview_flashcards_from_file(studyset_id, user_id, file):
    """Generate flashcards preview from file WITHOUT saving to database"""
    try:
        bot = FlashlyBot()
        
        # Extract text and generate flashcards data
        text = bot.extract_text(file)
        flashcards_data = bot.generate_flashcards(text)
        
        if not flashcards_data:
            raise ValueError("Failed to generate flashcards from file")
        
        # Return preview data without saving to database
        return {
            'success': True,
            'preview': True,
            'flashcards_count': len(flashcards_data),
            'flashcards': flashcards_data,  # Raw data, no UUIDs yet
            'source_file': file.filename
        }
        
    except Exception as e:
        raise e
    
def save_preview_flashcards(studyset_id, user_id, flashcards_data):
    """Save previewed flashcards to database after user approval"""
    try:
        flashcards = []
        for card_data in flashcards_data:
            flashcard = Flashcard(
                user_id=user_id,
                studyset_id=studyset_id,
                question=card_data['question'],
                answer=card_data['answer']
            )
            flashcards.append(flashcard)
            db.session.add(flashcard)
        
        db.session.commit()
        return {
            'success': True,
            'saved': True,
            'flashcards': [f.to_dict() for f in flashcards]
        }
        
    except Exception as e:
        db.session.rollback()
        raise e

def update_flashcards(studyset_id, user_id, data):
    """Bulk update flashcards for a study set"""
    try:
        # 1. DELETE: Remove flashcards marked for deletion
        delete_ids = data.get('delete_ids', [])
        if delete_ids:
            Flashcard.query.filter(
                Flashcard.id.in_(delete_ids),
                Flashcard.studyset_id == studyset_id,
                Flashcard.user_id == user_id  # Security: ensure user owns the flashcards
            ).delete(synchronize_session=False)

        # 2. UPDATE & CREATE: Process flashcards array
        updated_flashcards = []
        for card_data in data.get('flashcards', []):
            
            if 'id' in card_data and card_data['id']:
                # UPDATE existing flashcard
                flashcard = Flashcard.query.filter_by(
                    id=card_data['id'],
                    studyset_id=studyset_id,
                    user_id=user_id  # Security: ensure user owns the flashcard
                ).first()
                
                if flashcard:
                    flashcard.question = card_data['question']
                    flashcard.answer = card_data['answer']
                    updated_flashcards.append(flashcard)
            
            else:
                # CREATE new flashcard (no id means new)
                new_flashcard = Flashcard(
                    user_id=user_id,
                    studyset_id=studyset_id,
                    question=card_data['question'],
                    answer=card_data['answer']
                )
                db.session.add(new_flashcard)
                updated_flashcards.append(new_flashcard)

        # 3. COMMIT all changes in one transaction
        db.session.commit()
        
        # 4. Return updated flashcards for the studyset
        final_flashcards = Flashcard.query.filter_by(studyset_id=studyset_id).all()
        
        return {
            'success': True,
            'flashcards': [f.to_dict() for f in final_flashcards]
        }
        
    except Exception as e:
        db.session.rollback()
        raise e
    
def delete_flashcard(flashcard_id):
    """Delete a single flashcard"""
    try:
        flashcard = Flashcard.query.get(flashcard_id)
        if not flashcard:
            return False
        
        db.session.delete(flashcard)
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        raise e