SELECT name, quantity, price, quantity*price AS subtotal
FROM orders
JOIN order_items ON orders.id = order_id
JOIN items ON item_id = items.id
WHERE orders.id=1;


-- output:

--    name    | quantity | price | total
-- -----------+----------+-------+-------
--  Lasagna   |        3 |   299 |   897
--  Ice cream |        1 |   999 |   999
-- (2 rows)



-- expected output when using a helper function (input should be order_id):

-- [
--   { name: Lasagna, quantity: 3, price: 299, total: 897 }
--   { name: Ice cream, quantity: 1, price: 999, total: 999 }
-- ]
