# Multi-stage build for React + Django
# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-build

WORKDIR /frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source
COPY frontend/ ./

# Build React app
RUN npm run build

# Stage 2: Python backend
FROM python:3.10-slim

WORKDIR /app

# Install system dependencies required for the app and ML libraries
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Upgrade pip and install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the entire Django project
COPY bakery_project/ /app/bakery_project/

# Copy React build from frontend stage
COPY --from=frontend-build /frontend/dist /app/frontend/dist

# Set working directory to where manage.py is located
WORKDIR /app/bakery_project

# Create necessary directories
RUN mkdir -p staticfiles media

# Copy .env file if exists (for environment variables)
# Make sure to create .env on server with your actual credentials

# Collect static files
RUN python manage.py collectstatic --noinput || true

# Expose port
EXPOSE 8000

# Set environment variables
ENV DJANGO_SETTINGS_MODULE=bakery_project.settings
ENV PYTHONUNBUFFERED=1

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000')" || exit 1

# Run gunicorn with optimized settings
CMD ["gunicorn", "bakery_project.wsgi:application", \
     "--bind", "0.0.0.0:8000", \
     "--workers", "3", \
     "--threads", "2", \
     "--timeout", "120", \
     "--access-logfile", "-", \
     "--error-logfile", "-", \
     "--log-level", "info"]
