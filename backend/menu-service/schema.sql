CREATE TABLE IF NOT EXISTS restaurant_restaurants (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cuisine TEXT,
  rating NUMERIC(2,1),
  logo_key TEXT NOT NULL,
  address_json JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS menu_items (
  id BIGSERIAL PRIMARY KEY,
  restaurant_slug TEXT NOT NULL REFERENCES restaurant_restaurants(slug) ON UPDATE CASCADE ON DELETE RESTRICT,
  name TEXT NOT NULL,
  description TEXT,
  price_paise INT NOT NULL CHECK (price_paise >= 0),
  image_key TEXT NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_slug ON menu_items(restaurant_slug);
