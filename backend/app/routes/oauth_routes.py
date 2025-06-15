from flask import Blueprint
from app.controllers.oauth_controllers import oauth2_authorize, oauth2_callback

oauth_bp = Blueprint("oauth", __name__, url_prefix="/oauth")

@oauth_bp.route("/authorize/<provider>")
def authorize(provider):
    return oauth2_authorize(provider)

@oauth_bp.route("/callback/<provider>")
def callback(provider):
    return oauth2_callback(provider)