from flask import jsonify
from flask_jwt_extended import create_access_token, set_access_cookies
from werkzeug.security import check_password_hash, generate_password_hash
from app.models import User
from app import db

def login_user(data):
    user = User.query.filter_by(email=data["email"]).first()

    if not user or not check_password_hash(user.password_hash, data["password"]):
        return jsonify({"msg": "Invalid credentials"}), 401

    token = create_access_token(identity=str(user.id))
    response = jsonify({"msg": "Login successful"})
    set_access_cookies(response, token)
    return response

def register_user(data):
    # Check if email already exists
    existing_email = User.query.filter_by(email=data["email"]).first()
    if existing_email:
        return jsonify({"error": "Email already registered"}), 409
    
    # Check if username already exists
    existing_username = User.query.filter_by(username=data["username"]).first()
    if existing_username:
        return jsonify({"error": "Username already taken"}), 409
    
    try:
        hashed_password = generate_password_hash(data["password"])
        user = User(
            username=data["username"],
            email=data["email"],
            password_hash=hashed_password
        )
        db.session.add(user)
        db.session.commit()
        return {"id": str(user.id), "username": user.username, "email": user.email}
    except Exception as e:
        db.session.rollback()
        raise e

def get_profile_user(user_id):
    user = User.query.get(user_id)
    return jsonify({
        "id": str(user.id),
        "email": user.email,
        "username": user.username
    })