-- photos from: https://unsplash.com/

-- Items table seeds here
INSERT INTO items (name, description, price, image_url)
VALUES ('Lasagna', 'Fatima''s favourite lasagna! You should have at least 10 of them! (made with ground beef, onions, peppers, garlic, tomatoes, oregano, parsley, Italian Seasoning)', 799, 'https://images.unsplash.com/photo-1560035285-64808ba47bda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80'),
('Ice cream', 'A well-served ice cream (flavours: vanilla, chocolate, cookies & cream, or strawberry; toppings: cookies, M&M''s, or Nutella; sauces: chocolate or caramel)', 499, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=564&q=80'),
('Chicken wings', 'Boneless wings (served with celery and blue cheese dip)', 1299, 'https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=633&q=80');

INSERT INTO items (name, description, price, image_url, available)
VALUES ('Hungry Labber Burger', 'The best burger in town! (made with two all-beef patties, bacon, cheese, green leaf lettuce, tomato, pickles, onions, homemade special sauce)', 999, 'https://images.unsplash.com/photo-1561758033-7e924f619b47?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80', false);
