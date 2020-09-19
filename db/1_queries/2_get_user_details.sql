SELECT name, phone
FROM orders
JOIN users ON user_id = users.id
WHERE orders.id=1;


-- output:

--  name  |   phone
-- -------+------------
--  Alice | 4161234567
-- (1 row)



-- expected output when using a helper function (input should be order_id):

-- { name: Alice, phone: 4161234567 }
