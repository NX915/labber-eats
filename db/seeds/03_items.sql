-- photos from: https://unsplash.com/

-- Items table seeds here
INSERT INTO items (name, prep_time, acronym, description, price, image_url, category_id)
VALUES ('Lasagna', 35, 'LAS', 'Fatima''s favourite lasagna! You should have at least 10 of them! (made with ground beef, onions, peppers, garlic, tomatoes, oregano, parsley, italian seasoning)', 799, 'https://images.unsplash.com/photo-1560035285-64808ba47bda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80', 2),
('Ice cream', 10, 'ICE', 'A well-served ice cream (flavours: vanilla, chocolate, cookies & cream, or strawberry; toppings: cookies, M&M''s, or Nutella; sauces: chocolate or caramel)', 499, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=564&q=80', 4),
('Chicken wings', 25, 'CKNWG', 'Boneless wings (served with celery and blue cheese dip)', 1299, 'https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=633&q=80', 1),
('Shrimp and fries', 20, 'SHPF', 'Breaded shrimps and french fries with salad and special sauce', 1299, 'https://images.unsplash.com/photo-1576777647209-e8733d7b851d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80', 1),
('French fries', 15, 'FF', 'A portion of fries prepared with special condiments', 899, 'https://images.unsplash.com/photo-1529589510304-b7e994a92f60?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80', 1),
('Nachos', 10, 'NAC', 'Cheese nachos with assorted toppings of beef, chicken and beans, all covered with lettuce, tomatoes and sour cream', 1099, 'https://images.unsplash.com/photo-1570466199120-80bba1eabad7?ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80', 1),
('Chocolate cake', 10, 'CAKE', 'A delicious slice of the best chocolate cake in the world!!', 699, 'https://images.unsplash.com/photo-1569580990590-478357ea38ab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=633&q=80', 4),
('Beer', 5, 'BEER', '341 mL of our homemade beer', 899, 'https://images.unsplash.com/photo-1586993451228-09818021e309?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80', 5),
('Coca-cola', 5, 'CC', '355 mL coca-cola can', 399, 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80', 5),
('Water', 5, 'WATER', '500 mL water bottle', 299, 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=635&q=80', 5),
('Orange Juice', 5, 'ORANG', '333 mL orange juice bottle', 499, 'https://images.unsplash.com/photo-1587015990127-424b954e38b5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1868&q=80', 5);
-- Chef's specials(3) keep this category empty for now to check if it does not show up in our page
-- ?


-- One unavailable item to test
INSERT INTO items (name, prep_time, acronym, description, price, image_url, available, category_id)
VALUES ('Hungry Labber Burger', 15, 'HLB', 'The best burger in town! (made with two all-beef patties, bacon, cheese, green leaf lettuce, tomato, pickles, onions, homemade special sauce)', 999, 'https://images.unsplash.com/photo-1561758033-7e924f619b47?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80', false, 2);
