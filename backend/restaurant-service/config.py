import os

def get_db_url():
    # Prefer DATABASE_URL if provided (e.g. postgres://user:pass@host:5432/db)
    url = os.getenv("DATABASE_URL")
    if url:
        return url
    host = os.getenv("DB_HOST", "localhost")
    port = os.getenv("DB_PORT", "5432")
    name = os.getenv("DB_NAME", "foodapp")
    user = os.getenv("DB_USER", "postgres")
    pw = os.getenv("DB_PASS", "postgres")
    return f"postgresql+psycopg://{user}:{pw}@{host}:{port}/{name}"

SERVICE_PORT = int(os.getenv("SERVICE_PORT", "8081"))
# Store S3 object keys in DB; frontend builds CloudFront URL.
S3_BASE_PREFIX = os.getenv("S3_BASE_PREFIX", "restaurants/")
