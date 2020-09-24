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
(14, 3, 2);
