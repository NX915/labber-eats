-- photos from: https://unsplash.com/

-- Items table seeds here
INSERT INTO items (name, description, price, image_url)
VALUES ('Lasagna', 'Dish 1 is salty :|', 299, 'https://images.unsplash.com/photo-1560035285-64808ba47bda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80'),
('Ice cream', 'Dish 2 is sweet :)', 999, 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=564&q=80'),
('Buffalo wings', 'Dish 3 is spicy :O', 1299, 'https://images.unsplash.com/photo-1571162437205-8889ff2fee26?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80');

INSERT INTO items (name, description, price, image_url, available)
VALUES ('Hamburger', 'Just a regular hamburger', 499, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1202&q=80', false);
