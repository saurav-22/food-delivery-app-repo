package cart

import (
	"context"
	"errors"
	"time"

	"github.com/jackc/pgx/v5"
	"cart-service/internal/db"
)

var (
	ErrDifferentRestaurant = errors.New("cart belongs to another restaurant")
)

func findActiveCart(ctx context.Context, userID int64) (*Cart, error) {
	row := db.Pool.QueryRow(ctx,
		`SELECT id, user_id, restaurant_slug, created_at, updated_at
		 FROM carts WHERE user_id=$1 ORDER BY id DESC LIMIT 1`, userID)

	var c Cart
	err := row.Scan(&c.ID, &c.UserID, &c.RestaurantSlug, &c.CreatedAt, &c.UpdatedAt)
	if err == pgx.ErrNoRows {
		return nil, nil
	}
	return &c, err
}

func clearCart(ctx context.Context, cartID int64) error {
	_, err := db.Pool.Exec(ctx, `DELETE FROM carts WHERE id=$1`, cartID)
	return err
}

func createCart(ctx context.Context, userID int64, slug string) (*Cart, error) {
	row := db.Pool.QueryRow(ctx,
		`INSERT INTO carts (user_id, restaurant_slug) VALUES ($1,$2)
		 RETURNING id, user_id, restaurant_slug, created_at, updated_at`,
		userID, slug)

	var c Cart
	err := row.Scan(&c.ID, &c.UserID, &c.RestaurantSlug, &c.CreatedAt, &c.UpdatedAt)
	return &c, err
}

func insertItem(ctx context.Context, cartID, menuItemID int64, pricePaise, qty int) error {
	_, err := db.Pool.Exec(ctx,
		`INSERT INTO cart_items (cart_id, menu_item_id, qty, price_snapshot_paise)
		 VALUES ($1,$2,$3,$4)`,
		cartID, menuItemID, qty, pricePaise)
	return err
}

func updateItemQty(ctx context.Context, itemID int64, qty int) error {
	_, err := db.Pool.Exec(ctx,
		`UPDATE cart_items SET qty=$1, updated_at=now() WHERE id=$2`, qty, itemID)
	return err
}

func listItemsAndSubtotal(ctx context.Context, cartID int64) ([]ItemView, int, error) {
	rows, err := db.Pool.Query(ctx,
		`SELECT id, menu_item_id, qty, price_snapshot_paise
		 FROM cart_items WHERE cart_id=$1`, cartID)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var items []ItemView
	total := 0
	for rows.Next() {
		var it ItemView
		rows.Scan(&it.ID, &it.MenuItemID, &it.Qty, &it.PriceSnapshotPaise)
		items = append(items, it)
		total += it.PriceSnapshotPaise * it.Qty
	}
	return items, total, nil
}
