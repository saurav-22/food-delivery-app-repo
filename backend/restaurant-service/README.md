# Restaurant-service (Flask + SQLAlchemy)

Serves restaurant catalog (names, slugs, cuisines, ratings, logo S3 keys).

## Env (injected externally; no dotenv)
- `DATABASE_URL` **or** (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`)
- `SERVICE_PORT` (default 8081)
- `S3_BASE_PREFIX` (default `restaurants/`)

## Run locally
```bash
python -m venv .venv && source .venv/bin/activate   # (Windows: .venv\Scripts\activate)
pip install -r requirements.txt
```

# Set env, e.g.:
```bash
export DB_HOST=127.0.0.1
export DB_PORT=5432
export DB_NAME=foodapp
export DB_USER=postgres
export DB_PASS=postgres
```
```bash
python app.py
```
## API

- `GET /healthz` - Health check endpoint
- `GET /restaurants` - Get all restaurants
- `GET /restaurants/<slug>` - Get restaurant by slug
- `POST /restaurants` - Create new restaurant (admin/seed)

## Docker

```bash
docker build -t restaurant-service:local .
docker run --rm -p 8081:8081 \
  -e DB_HOST=host.docker.internal -e DB_PORT=5432 -e DB_NAME=foodapp \
  -e DB_USER=postgres -e DB_PASS=postgres \
  restaurant-service:local
```
## Seed Data
Use `seeds/seed_restaurants.json` with `POST /restaurants` (one-by-one) or write a quick script/curl loop.

## How to seed quickly (when DB is reachable)
### Example curl (run per item from the JSON above):
```bash
curl -X POST http://localhost:8081/restaurants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "KFC",
    "slug": "kfc",
    "cuisine": "Fried Chicken",
    "rating": 4.3,
    "logo_key": "restaurants/kfc/logo.jpg",
    "address_json": { "city": "Delhi", "pincode": "110001" }
  }'
```