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
        
        user = User.query.filter_by(email=email).first()
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        access_token = create_access_token(identity=str(user.id))
        
        response = jsonify({
            'message': 'Login successful',
            'token': access_token,  # ✅ Include token in response
            'user': {
                'id': str(user.id),
                'username': user.username,
                'email': user.email,
                'avatar_url': user.avatar_url
            }
        })
        
        # Still try to set cookies (for future compatibility)
        set_access_cookies(response, access_token)
        
        current_app.logger.info(f"✅ Login successful for: {email}")
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
@jwt_required(optional=True)  # ✅ Make JWT optional to handle both cookies and Bearer
def profile():
    try:
        # Try to get user from JWT (either cookie or Bearer token)
        current_user_id = get_jwt_identity()
        
        if not current_user_id:
            return jsonify({'error': 'No valid token found'}), 401
            
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        return jsonify({
            'user': {
                'id': str(user.id),
                'username': user.username,
                'email': user.email,
                'avatar_url': user.avatar_url,
                'oauth_provider': user.oauth_provider
            }
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Profile error: {str(e)}")
        return jsonify({'error': 'Failed to get profile'}), 500

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

