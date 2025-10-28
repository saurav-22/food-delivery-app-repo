# Build
FROM golang:1.23-alpine AS build

WORKDIR /app

# Copy mod files first for caching
COPY go.mod go.sum ./

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
CMD ["./cart-service"]
