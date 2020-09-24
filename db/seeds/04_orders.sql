-- orders table seeds here
INSERT INTO orders (user_id)
VALUES (1),
(3),
(4),
(2),
(5);


-- some orders that were already accepted, but not completed
INSERT INTO orders (user_id, accepted, informed_time)
VALUES (1, TRUE, 20),
(3, TRUE, 10),
(4, TRUE, 15);



-- some orders that were already accepted and completed
INSERT INTO orders (user_id, accepted, completed_at)
VALUES (1, TRUE, now()),
(1, TRUE, now());


-- some orders that were rejected
INSERT INTO orders (user_id, accepted)
VALUES (1, FALSE),
(1, FALSE);

-- orders with comments
INSERT INTO orders (user_id, comment)
VALUES (1, 'No ice!'),
(3, 'No spicy and dip apart. Please make sure to follow this instruction. The last time I ordered I could not eat because of how spicy it was!!');

-- some orders that are ready
INSERT INTO orders (user_id, ready_at, accepted)
VALUES (1, now(), TRUE),
(1, now(), TRUE);
