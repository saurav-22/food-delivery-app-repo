# Build
FROM golang:1.23-alpine AS build

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download && go mod tidy

COPY . .
RUN CGO_ENABLED=0 go build -o cart-service ./cmd/server

# Runtime
FROM alpine:3.19

WORKDIR /app
COPY --from=build /app/cart-service .

EXPOSE 8084
CMD ["./cart-service"]
