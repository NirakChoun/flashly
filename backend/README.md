# Flashly Backend API

A Flask-based REST API for Flashly - an AI-powered flashcard generator that transforms study materials into personalized learning cards using Google's Gemini AI.

## 🚀 Features

- **AI-Powered Content Processing**: Convert PDFs into flashcards using Google Gemini AI
- **User Authentication**: JWT-based authentication with secure endpoints
- **Study Set Management**: Create, update, and organize flashcard collections
- **Flashcard CRUD Operations**: Full management of individual flashcards
- **PDF Text Extraction**: Extract text from PDF files using PyMuPDF
- **AI Preview System**: Generate and preview flashcards before saving
- **Database Migrations**: Alembic-powered database version control
- **RESTful API Design**: Clean, intuitive API endpoints

## 🛠 Tech Stack

- **Framework**: Flask (Python 3.13)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **AI Integration**: Google Gemini 1.5 Flash API
- **Authentication**: Flask-JWT-Extended
- **PDF Processing**: PyMuPDF (fitz)
- **Database Migrations**: Alembic
- **Environment Management**: UV package manager
- **File Handling**: Werkzeug file uploads

## 📋 Prerequisites

- Python 3.13+
- PostgreSQL 12+
- Google Gemini API key
- UV package manager (recommended) or pip

## ⚡ Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd flashly/backend

# Install UV package manager (if not installed)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install dependencies
uv sync
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/flashly

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-here
JWT_ACCESS_TOKEN_EXPIRES=3600  # 1 hour in seconds

# Google Gemini AI
GEMINI_API_KEY=your-gemini-api-key-here

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-flask-secret-key

# File Upload Configuration
MAX_CONTENT_LENGTH=16777216  # 16MB in bytes
UPLOAD_FOLDER=uploads/
```

### 3. Database Setup

```bash
# Create PostgreSQL database
createdb flashly

# Run migrations
uv run flask db upgrade
```

### 4. Run the Application

```bash
# Development mode
uv run python run.py

# Or using Flask CLI
uv run flask run

# Run with specific host/port
uv run flask run --host=0.0.0.0 --port=5000
```

The API will be available at `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── app/                    # Main application package
│   ├── __init__.py        # Flask app factory
│   ├── controllers/       # Business logic controllers
│   │   ├── auth_controllers.py
│   │   ├── flashcard_controllers.py
│   │   └── studyset_controllers.py
│   ├── models/            # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── User.py
│   │   ├── StudySet.py
│   │   └── Flashcard.py
│   └── routes/            # API route definitions
│       ├── auth_routes.py
│       ├── flashcard_routes.py
│       └── studyset_routes.py
├── migrations/            # Alembic database migrations
│   ├── versions/
│   ├── alembic.ini
│   └── env.py
├── utils/                 # Utility modules
│   └── flashly_bot.py    # AI processing class
├── uploads/              # File upload directory
├── .env                  # Environment variables
├── .gitignore
├── config.py             # Application configuration
├── pyproject.toml        # UV/Python dependencies
├── run.py                # Application entry point
└── README.md
```

## 🔌 API Endpoints

### Authentication

```http
POST   /api/auth/register          # Register new user
POST   /api/auth/login             # Login user
POST   /api/auth/logout            # Logout user (protected)
GET    /api/auth/profile           # Get user profile (protected)
```

### Study Sets

```http
GET    /api/studysets              # Get all user's study sets
POST   /api/studysets              # Create new study set
GET    /api/studysets/{id}         # Get specific study set
PUT    /api/studysets/{id}         # Update study set
DELETE /api/studysets/{id}         # Delete study set
GET    /api/studysets/{id}/flashcards  # Get study set's flashcards
```

### Flashcard Management

```http
GET    /api/studysets/{id}/flashcards           # Get flashcards in study set
PUT    /api/studysets/{id}/flashcards           # Bulk update flashcards
POST   /api/studysets/{id}/flashcards/generate  # Generate from PDF/text
POST   /api/studysets/{id}/flashcards/save-preview  # Save AI preview
```

### AI Generation Workflow

```http
# Step 1: Generate preview from uploaded file
POST   /api/studysets/{id}/flashcards/generate
Content-Type: multipart/form-data
Body: file=<pdf_file>

# Step 2: Save approved flashcards to database
POST   /api/studysets/{id}/flashcards/save-preview
Content-Type: application/json
Body: {"flashcards": [...]}
```

## 📊 Database Schema

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Study Sets Table

```sql
CREATE TABLE studysets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    source_file_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Flashcards Table

```sql
CREATE TABLE flashcards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    studyset_id UUID REFERENCES studysets(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🤖 AI Integration

### FlashlyBot Class

The `FlashlyBot` class handles AI-powered flashcard generation:

```python
from utils.flashly_bot import FlashlyBot

# Initialize the bot
bot = FlashlyBot()

# Extract text from PDF
text = bot.extract_text(pdf_file)

# Generate flashcards
flashcards = bot.generate_flashcards(text)
```

### PDF Processing

- Uses PyMuPDF for reliable PDF text extraction
- Handles various PDF formats and layouts
- Extracts clean, readable text for AI processing

### AI Response Cleaning

- Robust JSON parsing with multiple fallback strategies
- Handles malformed AI responses gracefully
- Ensures consistent flashcard format

## 🔧 Configuration

### Environment Variables

| Variable             | Description                                | Required |
| -------------------- | ------------------------------------------ | -------- |
| `DATABASE_URL`       | PostgreSQL connection string               | Yes      |
| `JWT_SECRET_KEY`     | Secret key for JWT tokens                  | Yes      |
| `GEMINI_API_KEY`     | Google Gemini API key                      | Yes      |
| `FLASK_ENV`          | Flask environment (development/production) | No       |
| `MAX_CONTENT_LENGTH` | Maximum file upload size in bytes          | No       |

### File Upload Limits

- Maximum file size: 16MB (configurable)
- Supported formats: PDF
- Files stored temporarily during processing

## 🗄️ Database Operations

### Migrations

```bash
# Create new migration
uv run flask db revision --autogenerate -m "Description"

# Apply migrations
uv run flask db upgrade

# Rollback migration
uv run flask db downgrade

# Check migration status
uv run flask db current
```

### Sample Migration Commands

```bash
# Initial database setup
uv run flask db init
uv run flask db migrate -m "Initial migration"
uv run flask db upgrade
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Request data validation and sanitization
- **CORS Protection**: Configurable cross-origin resource sharing
- **File Upload Security**: File type and size validation

## 🧪 Testing

```bash
# Run all tests
uv run pytest

# Run with coverage
uv run pytest --cov=app

# Run specific test file
uv run pytest tests/test_auth.py

# Run in verbose mode
uv run pytest -v
```

## 📝 API Usage Examples

### Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Generate Flashcards from PDF

```bash
curl -X POST http://localhost:5000/api/studysets/{studyset_id}/flashcards/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/document.pdf"
```

### Bulk Update Flashcards

```bash
curl -X PUT http://localhost:5000/api/studysets/{studyset_id}/flashcards \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "flashcards": [
      {"id": "uuid", "question": "Updated question", "answer": "Updated answer"},
      {"question": "New question", "answer": "New answer"}
    ],
    "delete_ids": ["uuid-to-delete-1", "uuid-to-delete-2"]
  }'
```

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**:

```env
FLASK_ENV=production
FLASK_DEBUG=False
DATABASE_URL=postgresql://user:pass@prod-host:5432/flashly
```

2. **Database Setup**:

```bash
# Run migrations in production
uv run flask db upgrade
```

3. **Application Server**:

```bash
# Using Gunicorn
uv add gunicorn
uv run gunicorn -w 4 -b 0.0.0.0:5000 run:app
```

### Docker Deployment

```dockerfile
FROM python:3.13-slim

WORKDIR /app
COPY . .

RUN pip install uv
RUN uv sync

EXPOSE 5000
CMD ["uv", "run", "gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "run:app"]
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**:

   - Check PostgreSQL is running
   - Verify DATABASE_URL format
   - Ensure database exists

2. **Gemini API Errors**:

   - Verify GEMINI_API_KEY is correct
   - Check API quota and billing
   - Review API rate limits

3. **File Upload Issues**:

   - Check MAX_CONTENT_LENGTH setting
   - Verify upload directory permissions
   - Ensure PDF file is not corrupted

4. **JWT Token Issues**:
   - Verify JWT_SECRET_KEY is set
   - Check token expiration time
   - Ensure proper Authorization header format

## 📚 Additional Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Google Gemini API](https://ai.google.dev/docs)
- [PyMuPDF Documentation](https://pymupdf.readthedocs.io/)
- [UV Package Manager](https://docs.astral.sh/uv/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

**Happy Learning with Flashly! 🎓✨**
