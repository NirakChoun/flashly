# 🎯 Flashly Backend API

**Flask-based REST API for AI-Powered Flashcard Learning Platform**

## 🚀 Features

- 🤖 **AI-Powered Generation** - Google Gemini AI for flashcard creation from PDFs
- 🔐 **JWT Authentication** - Secure token-based authentication with refresh tokens
- 🔑 **OAuth Integration** - Google & GitHub OAuth login support
- 📚 **Study Set Management** - Complete CRUD operations for study sets
- 🃏 **Flashcard Operations** - Create, read, update, delete flashcards
- 📄 **PDF Processing** - Extract text from PDFs using PyMuPDF

## 🛠️ Tech Stack

- **Flask 3.0** + **Python 3.13** + **UV Package Manager**
- **PostgreSQL** + **SQLAlchemy** + **Alembic Migrations**
- **Google Gemini 1.5 Flash** + **PyMuPDF**
- **Flask-JWT-Extended** + **OAuth2**

## ⚡ Quick Start

```bash
# Install dependencies
uv sync

# Setup environment
cp .env.production .env
# Edit .env with your credentials

# Database setup
createdb flashly
uv run flask db upgrade

# Run server
uv run python run.py
```

## 🔌 Core API Endpoints

### Authentication

```http
POST /api/auth/register     # Register user
POST /api/auth/login        # Login with email/password
POST /api/auth/logout       # Logout (clears JWT cookies)
GET  /api/auth/profile      # Get current user profile
```

### OAuth Integration

```http
GET  /api/oauth/authorize/google   # Initiate Google OAuth
GET  /api/oauth/authorize/github   # Initiate GitHub OAuth
GET  /api/oauth/callback/google    # Google OAuth callback
GET  /api/oauth/callback/github    # GitHub OAuth callback
```

### Study Sets

```http
GET    /api/studysets/             # Get all user study sets
POST   /api/studysets/             # Create new study set
GET    /api/studysets/{id}         # Get study set with flashcards
PUT    /api/studysets/{id}         # Update study set
DELETE /api/studysets/{id}         # Delete study set
```

### AI Flashcard Generation

```http
POST /api/studysets/{id}/flashcards/preview      # Generate preview from PDF
POST /api/studysets/{id}/flashcards/save-preview # Save approved flashcards
POST /api/studysets/{id}/flashcards              # Create flashcards manually
PUT  /api/studysets/{id}/flashcards              # Bulk update flashcards
```

## 🔐 Authentication & Security

### JWT Authentication

- **Access Token**: 1 hour expiry, stored in HTTP-only cookies
- **Refresh Token**: 30 days expiry, automatic renewal
- **Cookie Security**: SameSite, HttpOnly, Secure in production

```python
# JWT Configuration
JWT_SECRET_KEY = "your-secret-key"
JWT_COOKIE_SECURE = True  # Production only
JWT_COOKIE_SAMESITE = "Strict"  # Production
JWT_TOKEN_LOCATION = ["cookies"]
```

### OAuth2 Providers

#### Google OAuth

```python
GOOGLE_CLIENT_ID = "your-google-client-id"
GOOGLE_CLIENT_SECRET = "your-google-client-secret"
```

#### GitHub OAuth

```python
GITHUB_CLIENT_ID = "your-github-client-id"
GITHUB_CLIENT_SECRET = "your-github-client-secret"
```

### Security Features

- **Password Hashing**: Werkzeug bcrypt
- **CORS Protection**: Configurable origins
- **Input Validation**: Request data sanitization
- **File Upload Security**: Type/size validation (16MB limit)

## 🤖 AI Integration

### AI Workflow

1. **PDF Upload** → Text extraction with PyMuPDF
2. **AI Processing** → Gemini generates flashcards
3. **Preview** → User reviews generated content
4. **Save** → Approved flashcards saved to database

### Usage Example

```python
from utils.flashly_bot import FlashlyBot

bot = FlashlyBot()
text = bot.extract_text_from_pdf(pdf_file)
flashcards = bot.generate_flashcards(text, num_cards=10)
```

## 📊 Database Schema

```sql
-- Users (UUID primary keys)
users: id, username, email, password_hash, oauth_provider, oauth_id, avatar_url

-- Study Sets
studysets: id, user_id, title, description, is_ai_generated, source_file_name

-- Flashcards
flashcards: id, user_id, studyset_id, question, answer
```

## 🗄️ Database Operations

```bash
# Create migration
uv run flask db revision --autogenerate -m "Description"

# Apply migrations
uv run flask db upgrade

# Rollback
uv run flask db downgrade
```

## 🚀 Deployment

```bash
# Production server
uv run gunicorn -w 4 -b 0.0.0.0:5000 run:app

# Docker
docker build -t flashly-api .
docker run -p 5000:5000 flashly-api
```

## 📝 API Usage Examples

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"password123"}'
```

### Generate Flashcards

```bash
curl -X POST http://localhost:5000/api/studysets/{id}/flashcards/preview \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@document.pdf"
```

### OAuth Login

```bash
# Navigate to: http://localhost:5000/api/oauth/authorize/google
# User completes OAuth flow
# Redirected to: http://localhost:3000/home (with JWT cookies set)
```

---

**Built with ❤️ for students worldwide** 🎓✨
