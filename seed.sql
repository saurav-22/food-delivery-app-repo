BEGIN;

-- ===========================================
-- INSERT INTO restaurant_restaurants
-- ===========================================
INSERT INTO restaurant_restaurants
(name, slug, cuisine, rating, logo_key, address_json, created_at, updated_at)
VALUES
('Biryani Blues', 'biryani-blues', 'Biryani', 4.3,
 'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/biryani-blues/logo.jpg',
 '{"address": "N/A"}'::jsonb, now(), now()),
('Burger King', 'burger-king', 'Burgers', 4.1,
 'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/burger-king/logo.jpg',
 '{"address": "N/A"}'::jsonb, now(), now()),
('Domino''s', 'dominos', 'Pizza', 4.2,
 'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/dominos/logo.jpg',
 '{"address": "N/A"}'::jsonb, now(), now()),
('KFC', 'kfc', 'Fried Chicken', 4.3,
 'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/kfc/logo.jpg',
 '{"address": "N/A"}'::jsonb, now(), now()),
('McDonald''s', 'mcd', 'Fast Food', 4.2,
 'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/mcd/logo.jpg',
 '{"address": "N/A"}'::jsonb, now(), now()),
('Pizza Hut', 'pizza-hut', 'Pizza', 4.2,
 'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/pizza-hut/logo.jpg',
 '{"address": "N/A"}'::jsonb, now(), now());

-- ===========================================
-- INSERT INTO menu_items
-- ===========================================
INSERT INTO menu_items
(restaurant_slug, name, description, price_paise, image_key, is_available, created_at, updated_at)
VALUES
-- biryani-blues
('biryani-blues','Boneless Chicken Biryani','Aromatic basmati rice with tender chicken',25900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/biryani-blues/menu-1.jpg',true,now(),now()),
('biryani-blues','Chicken Biryani (Bone)','Classic Hyderabadi style',23900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/biryani-blues/menu-2.jpg',true,now(),now()),
('biryani-blues','Mutton Biryani','Slow-cooked mutton',32900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/biryani-blues/menu-3.jpg',true,now(),now()),
('biryani-blues','Paneer Biryani','Veggie delight',21900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/biryani-blues/menu-4.jpg',true,now(),now()),
('biryani-blues','Tandoori Chicken Biryani','Smoky flavors',27900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/biryani-blues/menu-5.jpg',true,now(),now()),

-- burger-king
('burger-king','Grilled Chicken Burger','Juicy grilled patty',18900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/burger-king/menu-1.jpg',true,now(),now()),
('burger-king','Classic French Fries','Crispy & golden',7900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/burger-king/menu-2.jpg',true,now(),now()),
('burger-king','Burger Meal','Burger + Fries + Drink',24900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/burger-king/menu-3.jpg',true,now(),now()),
('burger-king','Veg Burger','Paneer & veggie patty',15900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/burger-king/menu-4.jpg',true,now(),now()),
('burger-king','Veg Whopper Meal','Whopper + sides',27900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/burger-king/menu-5.jpg',true,now(),now()),

-- dominos
('dominos','Cheese Burst Pizza','Cheesy delight',29900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/dominos/menu-1.jpg',true,now(),now()),
('dominos','Chicken Pizza','Loaded with chicken',32900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/dominos/menu-2.jpg',true,now(),now()),
('dominos','Mexican Green Pizza','Spicy & tangy',27900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/dominos/menu-3.jpg',true,now(),now()),
('dominos','Veggie Paradise','Garden-fresh toppings',25900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/dominos/menu-4.jpg',true,now(),now()),
('dominos','Chicken Pepperoni','All-time favorite',33900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/dominos/menu-5.jpg',true,now(),now()),

-- kfc
('kfc','Hot & Crispy Legs','Signature crisp',22900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/kfc/menu-1.jpg',true,now(),now()),
('kfc','Hot & Crispy Meal','Meal combo',27900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/kfc/menu-2.jpg',true,now(),now()),
('kfc','Hot & Crispy Wings','Spicy wings',19900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/kfc/menu-3.jpg',true,now(),now()),
('kfc','Chicken Strips','Tender strips',18900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/kfc/menu-4.jpg',true,now(),now()),
('kfc','Chicken Popcorn','Bite-sized treats',17900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/kfc/menu-5.jpg',true,now(),now()),

-- mcd
('mcd','Chicken Maharaja Mac','Double-decker',24900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/mcd/menu-1.jpg',true,now(),now()),
('mcd','McSpicy Chicken','Hot & tasty',19900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/mcd/menu-2.jpg',true,now(),now()),
('mcd','French Fries','Crispy',7900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/mcd/menu-3.jpg',true,now(),now()),
('mcd','Happy Meal','Kid''s favorite',22900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/mcd/menu-4.jpg',true,now(),now()),
('mcd','McAloo Tikki Burger','Veg classic',14900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/mcd/menu-5.jpg',true,now(),now()),

-- pizza-hut
('pizza-hut','Cheese Burst Pizza','Extra cheese',29900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/pizza-hut/menu-1.jpg',true,now(),now()),
('pizza-hut','Veg Combo Pizza','Combo delight',26900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/pizza-hut/menu-2.jpg',true,now(),now()),
('pizza-hut','Tandoori Paneer Pizza','Smoky paneer',28900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/pizza-hut/menu-3.jpg',true,now(),now()),
('pizza-hut','Chicken Pepperoni','Classic',33900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/pizza-hut/menu-4.jpg',true,now(),now()),
('pizza-hut','Spicy Veg Pizza','Hot & tasty',25900,'https://saurav-food-app-bucket.s3.ap-south-1.amazonaws.com/restaurants/pizza-hut/menu-5.jpg',true,now(),now());

COMMIT;
