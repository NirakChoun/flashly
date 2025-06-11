from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Load configuration based on environment
    config_name = os.getenv('FLASK_ENV', 'development')
    if config_name == 'production':
        app.config.from_object('config.ProductionConfig')
    else:
        app.config.from_object('config.DevelopmentConfig')
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # Configure CORS with credentials support
    CORS(app, 
         origins=app.config['CORS_ORIGINS'],
         methods=app.config['CORS_METHODS'],
         allow_headers=app.config['CORS_HEADERS'],
         supports_credentials=app.config['CORS_SUPPORTS_CREDENTIALS']
    )
    
    # Register routes
    from .routes import register_routes
    register_routes(app)
    
    # Import models for migrations
    from .models import User
    from .models.studyset_model import StudySet
    from .models.flashcard_model import Flashcard
    
    return app