SELECT SUM(quantity*price) AS total_before_taxes, SUM(quantity*price*1.13) AS total_after_taxes
FROM orders
JOIN order_items ON orders.id = order_id
JOIN items ON item_id = items.id
WHERE orders.id=1;


-- output:

--  total_before_taxes | total_after_taxes
-- --------------------+-------------------
--                1896 |           2142.48
-- (1 row)



-- expected output when using a helper function (input should be order_id):

-- { total_before_taxes: 1896, total_after_taxes: 2142.48 }
