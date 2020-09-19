-- orders table seeds here
INSERT INTO orders (user_id)
VALUES (1),
(3),
(4),
(2),
(5);


-- some orders that were already accepted, but not completed
INSERT INTO orders (user_id, accepted)
VALUES (1, TRUE),
(3, TRUE),
(4, TRUE);



-- some orders that were already accepted and completed
INSERT INTO orders (user_id, accepted, completed_at)
VALUES (1, TRUE, now()),
(1, TRUE, now());


-- some orders that were rejected
INSERT INTO orders (user_id, accepted)
VALUES (1, FALSE),
(1, FALSE);
