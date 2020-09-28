-- orders table seeds here
INSERT INTO orders (user_id)
VALUES (1),
(3),
(4),
(2),
(5);

-- orders with comments
INSERT INTO orders (user_id, comment)
VALUES (1, 'No ice!'),
(3, 'No spicy and dip apart. Please make sure to follow this instruction. The last time I ordered I could not eat because of how spicy it was!!');

-- some orders that were already accepted, but not completed
INSERT INTO orders (user_id, accepted_at, informed_time)
VALUES (1, now(), 20),
(3, now(), 10),
(4, now(), 15);

-- some orders that were already accepted and completed
INSERT INTO orders (user_id, accepted_at, ready_at, completed_at)
VALUES (1, now(), now(), now()),
(1, now(), now(), now());

-- some orders that are ready
INSERT INTO orders (user_id, ready_at, accepted_at, informed_time)
VALUES (1, now(), now(), 0),
(1, now(), now(), 0);

-- some orders that were rejected
INSERT INTO orders (user_id, rejected_at)
VALUES (1, now()),
(1, now());
