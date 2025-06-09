from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, unset_jwt_cookies
from app.models import User
from backend.app.controllers.auth_controllers import login_user, register_user, get_me_user

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    return login_user(data)

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

@auth_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    return get_me_user(get_jwt_identity())

