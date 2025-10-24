package cart

import "time"

type Cart struct {
	ID             int64     `json:"id"`
	UserID         int64     `json:"user_id"`
	RestaurantSlug string    `json:"restaurant_slug"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type CartItem struct {
	ID                 int64     `json:"id"`
	CartID             int64     `json:"cart_id"`
	MenuItemID         int64     `json:"menu_item_id"`
	Qty                int       `json:"qty"`
	PriceSnapshotPaise int       `json:"price_snapshot_paise"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type CartWithItems struct {
	CartID         *int64      `json:"cart_id"`
	RestaurantSlug *string     `json:"restaurant_slug"`
	Items          []ItemView  `json:"items"`
	SubtotalPaise  int         `json:"subtotal_paise"`
}

type ItemView struct {
	ID                 int64  `json:"id"`
	MenuItemID         int64  `json:"menu_item_id"`
	Qty                int    `json:"qty"`
	PriceSnapshotPaise int    `json:"price_snapshot_paise"`
}
