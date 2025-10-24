# order-service (PHP Slim + PostgreSQL)

Creates and manages food orders. Fetches cart from cart-service, snapshots items,
saves to DB, and clears cart after successful order creation.

## Environment (injected externally)

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`
- `CART_SERVICE_URL` (e.g. `http://cart-service:8084`)
- App listens on port `80` inside container

## Database

Tables:
- `orders`
- `order_items`

Schema includes FK constraints and `CHECK(status IN ('PLACED','DELIVERED'))`

Run migration manually once (psql or Flyway or via init container):

```sql
\i db/migrate.sql
```

## API

### POST /orders
Create a new order.

Request body:
```json
{
  "user_id": 1,
  "address_id": 15,
  "payment_id": 999
}
```

Responses:
- `201`
```json
{"id":10,"status":"PLACED"}
```
- `400`
```json
{"error":"empty_cart"}
```
- `500`
```json
{"error":"order_failed"}
```

### GET /orders/{user_id}
List orders for a user.

### GET /orders/by-id/{order_id}
Fetch single order with items.

### PUT /orders/{order_id}/deliver
Sets status to `DELIVERED`.

## Run locally

```bash
composer install --no-dev
php -S 0.0.0.0:8085 -t public
```

## Docker

```bash
docker build -t order-service:local .
docker run --rm -p 8085:80 \
  -e DB_HOST=host.docker.internal -e DB_PORT=5432 \
  -e DB_NAME=foodapp -e DB_USER=postgres -e DB_PASS=postgres \
  -e CART_SERVICE_URL=http://host.docker.internal:8084 \
  order-service:local
```
