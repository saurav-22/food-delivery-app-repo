package db

import (
	"context"
	"fmt"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

func Connect() error {
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	name := os.Getenv("DB_NAME")
	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")

	if host == "" || user == "" || name == "" {
		return fmt.Errorf("DB env vars missing")
	}

	dsn := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s",
		user, pass, host, port, name,
	)

	cfg, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return err
	}
	cfg.MaxConns = 10

	pool, err := pgxpool.NewWithConfig(context.Background(), cfg)
	if err != nil {
		return err
	}
	Pool = pool
	return nil
}

func RunMigrations() error {
	sql, err := os.ReadFile("internal/db/migrate.sql")
	if err != nil {
		return err
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_, err = Pool.Exec(ctx, string(sql))
	return err
}
