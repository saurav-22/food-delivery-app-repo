# Build
FROM golang:1.23-alpine AS build

WORKDIR /app

# Copy mod files first for caching
COPY go.mod ./

# Download dependencies
RUN go mod download

# Copy full source
COPY . .

# Regenerate go.sum for missing entries
RUN go mod tidy

# Build binary
RUN CGO_ENABLED=0 go build -o cart-service ./cmd/server

# Runtime
FROM alpine:3.19

WORKDIR /app
COPY --from=build /app/cart-service .

EXPOSE 8084
RUN apk add --no-cache curl

# Healthcheck for container orchestrators
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
	CMD curl -f http://localhost:8084/healthz || exit 1

CMD ["./cart-service"]
