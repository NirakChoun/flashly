from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.studyset_controllers import get_all_studysets, create_studyset, get_studyset_by_id, update_studyset, delete_studyset
from app.controllers.flashcard_controllers import get_flashcards_by_studyset, update_flashcards, create_flashcards, preview_flashcards_from_file, save_preview_flashcards

studyset_bp = Blueprint("studyset", __name__, url_prefix="/studysets")

@studyset_bp.route("/", methods=["GET"])
@jwt_required()
def get_user_studysets():
    user_id = get_jwt_identity()
    studysets = get_all_studysets(user_id)
    return jsonify(studysets)

@studyset_bp.route("/", methods=["POST"])
@jwt_required()
def post_studyset():
    user_id = get_jwt_identity()
    data = request.get_json()
    studyset = create_studyset(user_id, data)
    return jsonify(studyset), 201

@studyset_bp.route("/<uuid:id>", methods=["PUT"])
@jwt_required()
def put_studyset(id):
    data = request.get_json()
    studyset = update_studyset(id, data)
    if studyset is None:
        return jsonify({"error": "Study set not found"}), 404
    
    return jsonify(studyset)

@studyset_bp.route("/<uuid:id>", methods=["DELETE"])
@jwt_required()
def remove_studyset(id):
    success = delete_studyset(id)
    if not success:
        return jsonify({"error": "Study set not found"}), 404
    return jsonify({"message": f"Study set {id} deleted successfully"})

@studyset_bp.route("/<uuid:studyset_id>", methods=["GET"])
@jwt_required()
def get_studyset_flashcards(studyset_id):
    studyset = get_studyset_by_id(studyset_id)
    if not studyset:
        return jsonify({"error": "Study set not found"}), 404
    
    flashcards = get_flashcards_by_studyset(studyset_id)
    
    return jsonify({
        "studyset": studyset,
        "flashcards": flashcards
    })

@studyset_bp.route("/<uuid:studyset_id>/flashcards", methods=["POST"])
@jwt_required()
def post_studyset_flashcards(studyset_id):
    # Check if studyset exists first
    studyset = get_studyset_by_id(studyset_id)
    if not studyset:
        return jsonify({"error": "Study set not found"}), 404
    
    data = request.get_json()
    user_id = get_jwt_identity()
    
    # Validate that flashcards data exists
    flashcards_data = data.get('flashcards', [])
    if not flashcards_data:
        return jsonify({"error": "No flashcards data provided"}), 400
    
    try:
        # Create flashcards for this study set
        created_flashcards = create_flashcards(studyset_id, user_id, flashcards_data)
        
        return jsonify({
            "success": True,
            "message": f"Created {len(created_flashcards)} flashcards",
            "flashcards": created_flashcards
        }), 201
        
    except Exception as e:
        return jsonify({"error": f"Failed to create flashcards: {str(e)}"}), 500
    
@studyset_bp.route("/<uuid:studyset_id>/flashcards/preview", methods=["POST"])
@jwt_required()
def post_studyset_flashcards_preview(studyset_id):
    """Step 1: Generate preview without saving"""
    studyset = get_studyset_by_id(studyset_id)
    if not studyset:
        return jsonify({"error": "Study set not found"}), 404
    
    user_id = get_jwt_identity()
    if studyset['user_id'] != str(user_id):
        return jsonify({"error": "Unauthorized"}), 403
    
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    
    try:
        result = preview_flashcards_from_file(studyset_id, user_id, file)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@studyset_bp.route("/<uuid:studyset_id>/flashcards/save-preview", methods=["POST"])
@jwt_required()
def post_save_preview_flashcards(studyset_id):
    """Step 2: Save approved preview to database"""
    studyset = get_studyset_by_id(studyset_id)
    if not studyset:
        return jsonify({"error": "Study set not found"}), 404
    
    user_id = get_jwt_identity()
    if studyset['user_id'] != str(user_id):
        return jsonify({"error": "Unauthorized"}), 403
    
    data = request.get_json()
    flashcards_data = data.get('flashcards', [])
    
    if not flashcards_data:
        return jsonify({"error": "No flashcards data to save"}), 400
    
    try:
        result = save_preview_flashcards(studyset_id, user_id, flashcards_data)
        
        # Update studyset metadata
        update_studyset(studyset_id, {
            'is_ai_generated': True,
            'source_file_name': data.get('source_file_name')
        })
        
        return jsonify(result), 201
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@studyset_bp.route("/<uuid:studyset_id>/flashcards", methods=["PUT"])
@jwt_required()
def update_studyset_flashcards(studyset_id):
    data = request.get_json()
    user_id = get_jwt_identity()
    
    # data structure: {
    #   "flashcards": [
    #     {"id": "uuid", "question": "...", "answer": "..."},  # update existing
    #     {"question": "...", "answer": "..."},               # create new (no id)
    #   ],
    #   "delete_ids": ["uuid1", "uuid2"]                      # delete these
    # }
    
    result = update_flashcards(studyset_id, user_id, data)
    return jsonify(result)

