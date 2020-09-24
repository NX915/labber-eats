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
