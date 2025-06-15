from .auth_routes import auth_bp
from .studyset_routes import studyset_bp
from .oauth_routes import oauth_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(studyset_bp)
    app.register_blueprint(oauth_bp)