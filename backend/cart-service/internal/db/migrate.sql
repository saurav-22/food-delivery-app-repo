CREATE TABLE IF NOT EXISTS carts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    restaurant_slug TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
    id BIGSERIAL PRIMARY KEY,
    cart_id BIGINT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    menu_item_id BIGINT NOT NULL,
    qty INT NOT NULL CHECK (qty > 0),
    price_snapshot_paise INT NOT NULL CHECK (price_snapshot_paise >= 0),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- helpful index
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
