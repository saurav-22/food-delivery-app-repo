FROM golang:1.22-alpine AS build

WORKDIR /app

# Download deps first for caching
COPY go.mod go.sum ./
RUN go mod download

# Copy source
COPY . .

# Build binary
RUN CGO_ENABLED=0 go build -o cart-service ./cmd/server

# ---- RUNTIME IMAGE ----
FROM alpine:3.19

WORKDIR /app
COPY --from=build /app/cart-service .

EXPOSE 8084
CMD ["./cart-service"]
