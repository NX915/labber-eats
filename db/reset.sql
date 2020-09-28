-- Drop and recreate users table
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  type VARCHAR(255) DEFAULT 'customer'
);

-- Drop and recreate items table
DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT
);

-- Drop and recreate items table
DROP TABLE IF EXISTS items CASCADE;
CREATE TABLE items (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT 't',
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  acronym VARCHAR(5) NOT NULL,
  prep_time INTEGER NOT NULL
);

-- Drop and recreate orders table
DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders (
  id SERIAL PRIMARY KEY NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  comment VARCHAR(255),
  accepted_at TIMESTAMP,
  informed_time INTEGER,
  rejected_at TIMESTAMP,
  ready_at TIMESTAMP,
  completed_at TIMESTAMP,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- Drop and recreate order_items table
DROP TABLE IF EXISTS order_items CASCADE;
CREATE TABLE order_items (
  -- id SERIAL PRIMARY KEY NOT NULL,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  PRIMARY KEY (order_id, item_id)
);

-- Users table seeds here
INSERT INTO users (name, phone)
VALUES ('Alice', '4161234567'),
('Kira', '6477654321'),
('Jack', '4162222222'),
('Jenny', '6479999999'),
('Rob', '6474567890');

-- Categories table seeds here
INSERT INTO categories (name, description)
VALUES ('Appetizers', 'Perfect to share with your friends 🤝'),
('Entrées', 'Enjoy one of our best sellers 🍽'),
('Chef''s specials', 'Dishes selected by the renowned chef Francis Bourgouin 👨🏻‍🍳'),
('Desserts', 'The sweetest options in town 😋'),
('Beverages', 'Kill your thirst 🍻');

-- photos from: https://unsplash.com/

-- Items table seeds here
INSERT INTO items (name, prep_time, acronym, description, price, image_url, category_id)
VALUES ('Lasagna', 35, 'LAS', 'Fatima''s favourite lasagna! You should have at least 10 of them! (made with ground beef, onions, peppers, garlic, tomatoes, oregano, parsley and italian seasoning)', 1199, 'https://images.unsplash.com/photo-1560035285-64808ba47bda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80', 2),

('Sundae', 10, 'SUN', 'A well-served sundae (two scoops of vanilla ice cream, two scoops of chocolate ice cream, Oreo cookies and Nutella)', 899, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=564&q=80', 4),
('Chocolate Ice Cream', 5, 'CIC', 'Two scoops of chocolate ice cream', 599, 'https://images.unsplash.com/photo-1533072561526-0d9ee358c8bc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80', 4),
('Strawberry Ice Cream', 5, 'SIC', 'Two scoops of strawberry ice cream', 599, 'https://images.unsplash.com/photo-1555529211-3237f6e13d33?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1894&q=80', 4),

('Chicken Wings', 25, 'CKNWG', 'Boneless wings (served with celery and blue cheese dip)', 1299, 'https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=633&q=80', 1),
('Shrimp and Fries', 20, 'SHPF', 'Breaded shrimps and french fries with salad and special sauce', 1299, 'https://images.unsplash.com/photo-1576777647209-e8733d7b851d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80', 1),
('French Fries', 15, 'FF', 'A portion of fries prepared with special condiments', 899, 'https://images.unsplash.com/photo-1529589510304-b7e994a92f60?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80', 1),
('Nachos', 15, 'NAC', 'Cheese nachos with assorted toppings of beef, chicken and beans, all covered with lettuce, tomatoes and sour cream', 1099, 'https://images.unsplash.com/photo-1570466199120-80bba1eabad7?ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80', 1),
('Chocolate Cake', 10, 'CAKE', 'A delicious slice of the best chocolate cake in the world!!', 699, 'https://images.unsplash.com/photo-1569580990590-478357ea38ab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=633&q=80', 4),
('Beer', 5, 'BEER', '341 mL of our homemade beer', 899, 'https://images.unsplash.com/photo-1586993451228-09818021e309?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80', 5),
('Coca-Cola', 5, 'CC', '355 mL coca-cola can', 399, 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80', 5),
('Water', 5, 'WATER', '500 mL water bottle', 99, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=635&q=80', 5),
('Orange Juice', 5, 'ORANG', '333 mL orange juice bottle', 499, 'https://images.unsplash.com/photo-1587015990127-424b954e38b5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1868&q=80', 5),
('Hungry Labber Burger', 15, 'HLB', 'The best burger in town! (made with two all-beef patties, bacon, cheese, green leaf lettuce, tomato, pickles, onions, homemade special sauce)', 1199, 'https://images.unsplash.com/photo-1561758033-7e924f619b47?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80', 2),
('Shrimp Salad', 20, 'SSAD', 'A special shrimp salad (shrimps, olives, mixed salad greens, cashews, watermelon and parmesan)', 999, 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80', 2),
('Vegetarian salad', 15, 'VSAD', 'Mixed salad greens, tofu, beet, pears, nuts and squashes', 899, 'https://images.unsplash.com/photo-1547120013-70a72b9aba87?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80', 2),
('Falafel Salad', 20, 'FSAD', 'Our most sold salad (falafel, green been, beet, baby spinach and carrots)', 999, 'https://images.unsplash.com/photo-1576481564651-431d6109856a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=676&q=80', 2),
('Breaded Chicken', 20, 'BDCK', 'Breaded chicken with chips and ranch dip', 999, 'https://images.unsplash.com/photo-1564669656992-4d7466b1e8b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=676&q=80', 2);
-- Two unavailables Entrées
INSERT INTO items (name, prep_time, acronym, description, price, image_url, available, category_id)
VALUES ('Spaghetti', 20, 'SPA', 'Spaghetti with parsley, tomatoes, parmesan and pepper', 899, 'https://images.unsplash.com/photo-1591154405747-5ee97d563988?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=675&q=80', false, 2),
('Salmon Florentine', 25, 'SALFL', 'Chock full of spinach, garlic, and mild spices, and topped off with a creamy, buttery, delicious cream sauce', 1099, 'https://images.unsplash.com/photo-1580959375944-abd7e991f971?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80', false, 2);

-- orders table seeds here
INSERT INTO orders (user_id)
VALUES (1),
(3),
(4),
(2),
(5);


-- some orders that were already accepted, but not completed
INSERT INTO orders (user_id, accepted_at, informed_time)
VALUES (1, now(), 20),
(3, now(), 10),
(4, now(), 15);



-- some orders that were already accepted and completed
INSERT INTO orders (user_id, accepted_at, completed_at)
VALUES (1, now(), now()),
(1, now(), now());


-- some orders that were rejected
INSERT INTO orders (user_id, rejected_at)
VALUES (1, now()),
(1, now());

-- orders with comments
INSERT INTO orders (user_id, comment)
VALUES (1, 'No ice!'),
(3, 'No spicy and dip apart. Please make sure to follow this instruction. The last time I ordered I could not eat because of how spicy it was!!');

-- some orders that are ready
INSERT INTO orders (user_id, ready_at, accepted_at, informed_time)
VALUES (1, now(), now(), 0),
(1, now(), now(), 0);


-- orders table seeds here
INSERT INTO order_items (order_id, item_id, quantity)
VALUES
-- new orders
(1, 12, 3),
(1, 2, 1),
(2, 3, 4),
(2, 2, 2),
(2, 15, 1),
(3, 1, 3),
(4, 3, 10),
(4, 16, 2),
(5, 11, 2),
(5, 2, 2),
(5, 3, 3),
-- accepted but not completed
(6, 17, 3),
(6, 15, 1),
(6, 13, 5),
(7, 9, 3),
(8, 8, 4),
-- accepted and completed
(9, 7, 2),
(9, 4, 1),
(10, 6, 1),
-- rejected
(11, 3, 1),
(11, 4, 2),
(12, 5, 1),

-- with comments
(13, 1, 4),
(13, 9, 1),
(14, 3, 2),

-- ready
(15, 11, 1),
(16, 12, 2);
