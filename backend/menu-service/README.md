# Menu-service (Node.js + Express + pg)

Serves menu items per restaurant. Stores `image_key` like `restaurants/<slug>/menu-1.jpg`.

## Env (injected externally; no dotenv)
- `DB_HOST` (e.g., RDS endpoint)
- `DB_PORT` (default 5432)
- `DB_NAME` (e.g., foodapp)
- `DB_USER`
- `DB_PASS`
- `SERVICE_PORT` (default 8082)

## Run locally
```bash
npm install

export DB_HOST=127.0.0.1
export DB_PORT=5432
export DB_NAME=foodapp
export DB_USER=postgres
export DB_PASS=postgres
```

## Ensure schema
`npm run initdb`

## Start service
`npm run dev` or `npm start`

## API
- `GET /healthz`
- `GET /menu/:restaurant_slug`
- `POST /menu/:restaurant_slug` (body: `{name, description?, price_paise, image_key, is_available?}`)
- `PUT /menu/item/:id` (partial update)
- `DELETE /menu/item/:id`

## Seeding
- Put JSON files under `seeds/`. One file per restaurant slug.
- Use: `node index.js --seed <slug>` or `npm run seed` (seeds all).

### Seed file shape
```json
[
  {
    "name": "Cheese Burst Pizza",
    "description": "Loaded with cheese",
    "price_paise": 29900,
    "image_key": "restaurants/dominos/menu-1.jpg",
    "is_available": true
  }
]
```

## Docker
```bash
docker build -t menu-service:local .
docker run --rm -p 8082:8082 \
  -e DB_HOST=host.docker.internal -e DB_PORT=5432 -e DB_NAME=foodapp \
  -e DB_USER=postgres -e DB_PASS=postgres \
  menu-service:local
```

## How to run/seed quickly (local)
```bash
cd app-repo/backend/menu-service
npm install

# set env for DB (adjust host as needed)
export DB_HOST=127.0.0.1
export DB_PORT=5432
export DB_NAME=foodapp
export DB_USER=postgres
export DB_PASS=postgres

# ensure tables exist
npm run initdb

# seed all restaurants from seeds/*.json
npm run seed

# run service
npm run dev   # or: SERVICE_PORT=8082 npm start
```

### Test APIs
```bash
curl localhost:8082/healthz
curl localhost:8082/menu/kfc | jq .
```
