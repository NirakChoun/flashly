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
    hashed_password = generate_password_hash(data["password"])
    user = User(
        username=data["username"],
        email=data["email"],
        password_hash=hashed_password
    )
    db.session.add(user)
    db.session.commit()
    return {"id": str(user.id), "username": user.username, "email": user.email}

def get_me_user(user_id):
    user = User.query.get(user_id)
    return jsonify({
        "id": str(user.id),
        "email": user.email,
        "username": user.username
    })