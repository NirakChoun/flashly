import os

class Config:
    # Local Database (pgAdmin4)
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Secret Key
    SECRET_KEY = os.getenv("SECRET_KEY")

    # JWT Configurations
    JWT_TOKEN_LOCATION = ['cookies', 'headers']  # ✅ Accept both
    JWT_COOKIE_SECURE = True
    JWT_COOKIE_HTTPONLY = True
    JWT_COOKIE_SAMESITE = 'None'
    JWT_ACCESS_COOKIE_PATH = '/'
    JWT_COOKIE_CSRF_PROTECT = False
    JWT_COOKIE_DOMAIN = None
    
    # CORS Configuration
    CORS_ORIGINS = [os.getenv("FRONTEND_URL", "https://flashly-rftw.vercel.app")]
    CORS_METHODS = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    CORS_HEADERS = ["Content-Type", "Authorization"]
    CORS_SUPPORTS_CREDENTIALS = True  # Required for cookies

    # OAuth2 Providers Configuration
    OAUTH2_PROVIDERS = {
        'google': {
            'client_id': os.environ.get('GOOGLE_CLIENT_ID'),
            'client_secret': os.environ.get('GOOGLE_CLIENT_SECRET'),
            'authorize_url': 'https://accounts.google.com/o/oauth2/auth',
            'token_url': 'https://accounts.google.com/o/oauth2/token',
            'userinfo': {
                'url': 'https://www.googleapis.com/oauth2/v3/userinfo',
                'email': lambda json: json['email'],
                'name': lambda json: json.get('name', ''),
                'picture': lambda json: json.get('picture', ''),
            },
            'scopes': ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
        },
        'github': {
            'client_id': os.environ.get('GITHUB_CLIENT_ID'),
            'client_secret': os.environ.get('GITHUB_CLIENT_SECRET'),
            'authorize_url': 'https://github.com/login/oauth/authorize',
            'token_url': 'https://github.com/login/oauth/access_token',
            'userinfo': {
                'url': 'https://api.github.com/user',
                'email_url': 'https://api.github.com/user/emails',
                'email': lambda json: json[0]['email'] if isinstance(json, list) else json.get('email'),
                'name': lambda json: json.get('login', ''),
                'picture': lambda json: json.get('avatar_url', ''),
            },
            'scopes': ['user:email'],
        },
    }

class DevelopmentConfig(Config):
    DEBUG = True
    JWT_COOKIE_SECURE = False
    JWT_COOKIE_SAMESITE = "Lax"  # More permissive for development
    CORS_ORIGINS = ["http://localhost:3000", "http://localhost:5173"]  # Common frontend ports

class ProductionConfig(Config):
    DEBUG = False
    JWT_COOKIE_SECURE = True
    JWT_COOKIE_SAMESITE = "None"  # ✅ Change from "Strict" to "None"
    JWT_COOKIE_DOMAIN = None      # ✅ Let browser handle domain
    CORS_ORIGINS = [os.getenv("FRONTEND_URL", "https://flashly-rftw.vercel.app")]