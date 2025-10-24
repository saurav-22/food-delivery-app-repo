CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    address_id BIGINT NOT NULL,
    restaurant_slug TEXT NOT NULL,
    payment_id BIGINT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PLACED' CHECK (status IN ('PLACED','DELIVERED')),
    total_paise INT NOT NULL CHECK (total_paise >= 0),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id BIGINT NOT NULL,
    price_snapshot_paise INT NOT NULL CHECK (price_snapshot_paise >= 0),
    qty INT NOT NULL CHECK (qty > 0)
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
