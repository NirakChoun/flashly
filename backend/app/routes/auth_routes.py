from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, unset_jwt_cookies, create_access_token, set_access_cookies
from datetime import datetime  # ✅ Add this import for the test_cookie route
from app.models import User
from app.controllers.auth_controllers import login_user, register_user, get_profile_user

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        # Validate user credentials
        user = User.query.filter_by(email=email).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Create access token
        access_token = create_access_token(identity=str(user.id))
        
        # Create response
        response = jsonify({
            'message': 'Login successful',
            'user': {
                'id': str(user.id),
                'username': user.username,
                'email': user.email,
                'avatar_url': user.avatar_url
            }
        })
        
        # Set JWT cookies
        set_access_cookies(response, access_token)
        
        current_app.logger.info(f"✅ Login successful for: {user.email}")
        return response, 200
        
    except Exception as e:
        current_app.logger.error(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    email = data["email"]

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:   
        return jsonify({"error": "Email already registered"}), 409

    user = register_user(data)
    return jsonify(user), 201

@auth_bp.route("/logout", methods=["POST"])
def logout():
    response = jsonify({"msg": "Logout successful"})
    unset_jwt_cookies(response)
    return response

@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    return get_profile_user(get_jwt_identity())

@auth_bp.route('/test-cookie', methods=['GET'])
def test_cookie():
    """Test endpoint to verify cookie settings"""
    response = jsonify({'message': 'Cookie test', 'timestamp': str(datetime.utcnow())})
    
    # Set a test cookie
    response.set_cookie(
        'test_cookie',
        'test_value',
        max_age=3600,
        secure=True,
        httponly=False,
        samesite='None'
    )
    
    return response

