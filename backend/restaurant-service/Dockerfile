# Python slim for small image
FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install system deps for psycopg (build not needed with binary wheel, but libpq is good to have)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 curl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install python deps
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app
COPY . .

# Expose port
ENV SERVICE_PORT=8081
EXPOSE 8081

# Gunicorn for prod
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:8081", "app:app"]
