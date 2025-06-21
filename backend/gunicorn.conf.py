# Gunicorn config for unlimited flashcards
bind = "0.0.0.0:8000"
workers = 1
worker_class = "sync"
timeout = 120  # 2 minutes for large flashcard generation
keepalive = 2
max_requests = 100
max_requests_jitter = 10
preload_app = True