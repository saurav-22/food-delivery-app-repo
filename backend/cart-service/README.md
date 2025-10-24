# Cart-service (Go + Gin + PostgreSQL)

Maintains user's cart with single-restaurant rule.
Returns subtotal only. Used before order placement.

## Env (injected externally; no dotenv)
- `SERVICE_PORT` (default 8084)
- `DB_HOST` `DB_PORT` `DB_NAME` `DB_USER` `DB_PASS`

## API
- `GET    /cart/{user_id}`
- `POST   /cart/{user_id}/items`
- `PUT    /cart/{user_id}/items/{item_id}`
- `DELETE /cart/{user_id}`

## Payload for POST:
```json
{
  "restaurant_slug": "kfc",
  "menu_item_id": 101,
  "price_paise": 18900,
  "qty": 2
}
```

## Empty cart response:
```json
{
  "cart_id": null,
  "restaurant_slug": null,
  "items": [],
  "subtotal_paise": 0
}
```

## Run locally
```bash
SERVICE_PORT=8084 \
DB_HOST=127.0.0.1 DB_PORT=5432 \
DB_NAME=foodapp DB_USER=postgres DB_PASS=postgres \
go run ./cmd/server
```

### Docker
```bash
docker build -t cart-service:local .
docker run --rm -p 8084:8084 \
  -e DB_HOST=host.docker.internal -e DB_PORT=5432 \
  -e DB_NAME=foodapp -e DB_USER=postgres -e DB_PASS=postgres \
  cart-service:local
```