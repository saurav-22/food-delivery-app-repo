FROM python:3.12-slim

WORKDIR /app

# Install deps first for layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Expose app port
EXPOSE 8081

# Run with gunicorn (simple, not enterprise tuning)
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:8081", "app:app"]
