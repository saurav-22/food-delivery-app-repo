# user-service (Spring Boot + JPA + PostgreSQL)

Manages users and a single default address per user.

## Env (external-only)
- `SERVICE_PORT` (default 8083)
- `DB_HOST` (e.g., RDS endpoint)
- `DB_PORT` (default 5432)
- `DB_NAME` (e.g., foodapp)
- `DB_USER`
- `DB_PASS`

## Run locally
```bash
# from user-service/
./mvnw spring-boot:run   # if wrapper later
# OR standard maven:
mvn spring-boot:run
# or as jar:
mvn -DskipTests package
java -jar target/user-service-0.0.1.jar
```

## API (flat JSON)
- `GET /healthz
- `POST /users` -> `{name,email?,phone?}`
- `GET /users/{id}`
- `PUT /users/{id}` -> partial update
- `POST /users/{id}/address` -> `{street, city, pincode, lat?, lng?, isDefault?}`
- `GET /users/{id}/address`

## Docker
```bash
docker build -t user-service:local .
docker run --rm -p 8083:8083 \
  -e DB_HOST=host.docker.internal -e DB_PORT=5432 -e DB_NAME=foodapp \
  -e DB_USER=postgres -e DB_PASS=postgres \
  user-service:local
```
