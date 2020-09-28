module.exports = db => {

  // gets all available items to be displayed to the user. It returns an array
  const getMenu = () => {
    return db
      .query(`SELECT items.*, categories.name AS category, categories.description AS category_description
      FROM items JOIN categories ON category_id = categories.id
      ORDER BY category_id, items.name`)
      .then(res => res.rows)
      .catch(e => {
        throw e.message;
      });
  };

  // returns all new orders id as an array
  const getNewOrders = () => {
    return db
      .query('SELECT id FROM orders WHERE accepted_at IS NULL AND rejected_at IS NULL ORDER BY created_at')
      .then(res => res.rows)
      .catch(e => {
        throw e.message;
      });
  };

  // returns all new orders id as an array
  const getPendingOrders = () => {
    return db
      .query('SELECT id FROM orders WHERE accepted_at IS NOT NULL AND completed_at IS NULL ORDER BY created_at')
      .then(res => res.rows)
      .catch(e => {
        throw e.message;
      });
  };

  // returns an object with the order details
  const getOrderDetails = order_id => {
    const query = {
      text: `
        SELECT order_id, created_at, users.name, phone, comment, informed_time, ready_at, MAX(prep_time) AS estimated_wait, SUM(quantity * price) AS total
        FROM orders
        JOIN users ON user_id = users.id
        JOIN order_items ON orders.id = order_id
        JOIN items ON item_id = items.id
        WHERE orders.id = $1
        GROUP BY order_id, created_at, users.name, phone, comment, informed_time, ready_at;
      `,
      values: [order_id]
    };
    return db
      .query(query)
      .then(res => {
        if (res.rows[0]) {
          return res.rows[0];
        }
        throw 'The order id does not exist';
      })
      .catch(e => {
        throw e.message;
      });
  };


  // returns an array with every item that composes the order
  const getItemsFromOrder = order_id => {
    const query = {
      text: `
        SELECT name, quantity, acronym
        FROM orders
        JOIN order_items ON orders.id = order_id
        JOIN items ON item_id = items.id
        WHERE orders.id = $1;
      `,
      values: [order_id]
    };
    return db
      .query(query)
      .then(res => {
        if (res.rows.length > 0) {
          return res.rows;
        }
        throw 'The order id does not exist';
      })
      .catch(e => {
        throw e.message;
      });
  };

  // check some edge cases when submitting a new order so that no incomplete or incorrect orders change our database
  const checkErrors = (obj, itemsID) => {
    const { selectedItems, orderDetails } = obj;
    const phone = orderDetails.phone ? orderDetails.phone.toString().replace(/\D/g, "") : '';

    return new Promise((resolve, reject) => {

      // confirming that the user has selected at least one item (not an empty object)
      if (Object.keys(selectedItems).length === 0) {
        return reject('It seems that no item has been selected');
      }
      // confirming that a name was given
      if (!orderDetails.name) {
        return reject('The name field does not contain a valid input');
      }
      // confirming that a name was given
      if (orderDetails.comment && orderDetails.comment.length > 255) {
        return reject('The comment is longer than expected');
      }
      // confirming that the phone field is not empty or invalid, it has more than 10 characters and it contains valid numbers
      if (!phone) {
        return reject('The phone number is empty or invalid');
      }
      if (phone.length < 10) {
        return reject('The phone number is incomplete');
      }
      if (phone.length > 10) {
        return reject('The phone number is longer than expected');
      }
      // confirming that every item has a valid quantity
      for (const itemID in selectedItems) {
        if (selectedItems[itemID] <= 0) {
          return reject('It seems that not all of the selected quantities are valid');
        }
      }
      //  create a new query to check if every item_id in the order is valid. The query should count how many items are valid (available and existent)
      let checkItemsQuery = `SELECT COUNT(*) FROM items WHERE available = TRUE AND id IN (`;
      const checkItemsValues = [];
      itemsID.forEach(elem => {
        checkItemsQuery += `$${checkItemsValues.length + 1}, `;
        checkItemsValues.push(elem);
      });
      checkItemsQuery = checkItemsQuery.slice(0, -2) + ');';
      return db
        .query(checkItemsQuery, checkItemsValues)
        .then(res => {
          // after checking how many items are valid, we evaluate if the quantity is exactly the same as the different items present in an order
          if (Number(res.rows[0].count) === itemsID.length) {
            return resolve();
          }
          return reject('Some of the items are unavailable or not existing');
        });
    });
  };


  /* addOrder should react to a new order submission and update three tables: users, orders, and order_items
  expected input:
    { selectedItems: { item_id: quantity, item_id: quantity }, orderDetails: { name: 'name', phone: 'phone' } }
  example:
    { selectedItems: { 1:3, 3:5 }, orderDetails: { name: 'Danilo', phone: '1234567890' } }
  */
  const addOrder = obj => {
    const { selectedItems, orderDetails } = obj;
    // query to insert a new user, returning its id
    let userID;
    const newUserQuery = {
      text: `
      INSERT INTO users (name, phone)
      VALUES ($1, $2) RETURNING id;
      `,
      values: [orderDetails.name, orderDetails.phone ? orderDetails.phone.toString().replace(/\D/g, "") : '']
    };

    // the query text to insert a new order, returning its id
    let orderID;
    const newOrderQuery = `
      INSERT INTO orders (user_id, comment)
      VALUES ($1, $2) RETURNING id;
    `;

    // create a new let variable to hold the query text to create n rows in the order_items table, it will be updated with a for loop
    let assignItemsToOrderText = `INSERT INTO order_items (order_id, item_id, quantity)\nVALUES\n`;
    // define a itemsID array to later check if all the requested item_id are available and exist in our database
    const itemsID = [];
    // create an array to hold the values to the new query. It will be populated with a for loop and it will contain every pair of itemID and quantity
    const assignItemsToOrderValues = [];
    for (const itemID in selectedItems) {
      itemsID.push(itemID);
      assignItemsToOrderText += `($1, $${assignItemsToOrderValues.length + 2}, $${assignItemsToOrderValues.length + 3}),\n`;
      assignItemsToOrderValues.push(itemID);
      assignItemsToOrderValues.push(selectedItems[itemID]);
    }
    // delete the last row's extra new line and comma, and add the semicolon to finish the query
    assignItemsToOrderText = assignItemsToOrderText.slice(0, -2) + ';';

    // check if the obj is valid
    return checkErrors(obj, itemsID)
      // run the first query that will return the user_id
      .then(() => db.query(newUserQuery))
      .then(res => {
        userID = res.rows[0].id;
        const comment = orderDetails.comment || null;
        // run the second query to create a new order related to the user_id that submitted the order
        return db.query(newOrderQuery, [userID, comment]);
      })
      .then(res => {
        orderID = res.rows[0].id;
        // include the order_id as the first value in the values array
        assignItemsToOrderValues.unshift(orderID);
        // run the last query to create n rows in the order_items table
        return db.query(assignItemsToOrderText, assignItemsToOrderValues);
      })
      .catch(e => {
        throw e;
      });
  };

  // evaluate if the order was accepted and change the accepted column accordingly
  const processOrder = obj => {
    const values = [obj.order_id];
    const accepted = obj.accepted !== undefined && obj.accepted === false ? false : true;
    let text = `UPDATE orders
    SET `;
    if (accepted && obj.input) {
      text += `informed_time = $2,\n`;
      values.push(obj.input);
    }
    text += `${accepted ? 'accepted_at' : 'rejected_at'} = now()
    WHERE orders.id = $1
    RETURNING *
    `;
    return db
      .query(text, values)
      .then(res => {
        if (res.rows[0]) {
          return `The order acceptance was marked as ${accepted}${obj.input ? `and the informed_time was registered as ${obj.input}` : ''}`;
        }
        throw 'The order id does not exist';
      })
      .catch(e => {
        throw e.message;
      });
  };

  // mark the order as ready (change the ready_at column to now())
  const readyAt = order_id => {
    const query = {
      text: `
      UPDATE orders
      SET ready_at = now(),
      accepted_at = now(),
      informed_time = 0
      WHERE orders.id = $1
      RETURNING *
      `,
      values: [order_id]
    };
    return db
      .query(query)
      .then(res => {
        if (res.rows[0]) {
          return 'The order was marked as ready';
        }
        throw 'The order id does not exist';
      })
      .catch(e => {
        throw e.message;
      });
  };

  // mark the order as completed (change the completed_at column to now().
  const finishOrder = order_id => {
    const query = {
      text: `
      UPDATE orders
      SET completed_at = now()
      WHERE orders.id = $1
      RETURNING *
      `,
      values: [order_id]
    };
    return db
      .query(query)
      .then(res => {
        if (res.rows[0]) {
          return 'The order was marked as completed';
        }
        throw 'The order id does not exist';
      })
      .catch(e => {
        throw e.message;
      });
  };

  return {
    getMenu,
    getNewOrders,
    getPendingOrders,
    getOrderDetails,
    getItemsFromOrder,
    addOrder,
    processOrder,
    readyAt,
    finishOrder
  };
};
