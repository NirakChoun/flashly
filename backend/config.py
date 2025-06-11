import os

class Config:
    # Local Database (pgAdmin4)
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT Configurations
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_COOKIE_SECURE = os.getenv("JWT_COOKIE_SECURE", "False").lower() == "true"
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_COOKIE_HTTPONLY = True
    JWT_ACCESS_COOKIE_PATH = "/"
    JWT_REFRESH_COOKIE_PATH = "/token/refresh"
    JWT_COOKIE_CSRF_PROTECT = False
    
    # SameSite Configuration
    JWT_COOKIE_SAMESITE = os.getenv("JWT_COOKIE_SAMESITE", "Lax")
    
    # CORS Configuration
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
    CORS_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    CORS_HEADERS = ["Content-Type", "Authorization"]
    CORS_SUPPORTS_CREDENTIALS = True  # Required for cookies

class DevelopmentConfig(Config):
    DEBUG = True
    JWT_COOKIE_SECURE = False
    JWT_COOKIE_SAMESITE = "Lax"  # More permissive for development
    CORS_ORIGINS = ["http://localhost:3000", "http://localhost:5173"]  # Common frontend ports

class ProductionConfig(Config):
    DEBUG = False
    JWT_COOKIE_SECURE = True  # Requires HTTPS
    JWT_COOKIE_SAMESITE = "Strict"  # Strict for production
    CORS_ORIGINS = [os.getenv("FRONTEND_URL", "https://yourdomain.com")]