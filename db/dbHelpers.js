module.exports = db => {

  // gets all available items to be displayed to the user. It returns an array
  const getMenu = () => {
    return db
      .query('SELECT * FROM items')
      .then(res => res.rows);
  }

  // returns all new orders id as an array
  const getNewOrders = () => {
    return db
      .query('SELECT id FROM orders WHERE accepted IS NULL ORDER BY created_at')
      .then(res => res.rows);
  }

  // returns all new orders id as an array
  const getPendingOrders = () => {
    return db
      .query('SELECT id FROM orders WHERE accepted = TRUE AND completed_at IS NULL ORDER BY created_at')
      .then(res => res.rows);
  }

  // returns an object with the order details
  const getOrderDetails = order_id => {
    const query = {
      text: `
        SELECT order_id, created_at, users.name, phone, SUM(quantity * price) AS total
        FROM orders
        JOIN users ON user_id = users.id
        JOIN order_items ON orders.id = order_id
        JOIN items ON item_id = items.id
        WHERE orders.id = $1
        GROUP BY order_id, created_at, users.name, phone;
      `,
      values: [order_id]
    }
    return db
      .query(query)
      .then(res => {
        if (res.rows[0]) {
          return res.rows[0];
        }
        throw 'The order id does not exist'
      })
  }


  // returns an array with every item that composes the order
  const getItemsFromOrder = order_id => {
    const query = {
      text: `
        SELECT name, quantity
        FROM orders
        JOIN order_items ON orders.id = order_id
        JOIN items ON item_id = items.id
        WHERE orders.id = $1;
      `,
      values: [order_id]
    }
    return db
      .query(query)
      .then(res => {
        if (res.rows.length > 0) {
          return res.rows;
        }
        throw 'The order id does not exist'
      })
  }

  // check some edge cases when submitting a new order so that no incomplete or incorrect orders change our database
  const checkErrors = (obj, itemsID) => {
    const { selectedItems, userDetails } = obj;
    const phone = userDetails.phone ? userDetails.phone.toString().replace(/\D/g, "") : '';

    return new Promise((resolve, reject) => {

      // confirming that the user has selected at least one item (not an empty object)
      if (Object.keys(selectedItems).length === 0) {
        return reject('It seems that no item has been selected');
      }
      // confirming that both the name is filled
      if (!userDetails.name) {
        return reject('The name field does not contain a valid input');
      }
      // confirming that the phone field is not empty or invalid, it has more than 10 characters and it contains valid numbers
      if (!phone) {
        return reject('The phone number is empty or invalid');
      }
      if (phone.length < 10) {
        return reject('The phone number is incomplete');
      }
      if (phone.length > 31) {
        return reject('The phone number is longer than expected');
      }
      // confirming that every item has a valid quantity
      for (const itemID in selectedItems) {
        if (selectedItems[itemID] <= 0) {
          return reject('It seems that not all of the selected quantities are valid');
        }
      }
      //  create a new query to check if every item_id in the order is valid. The query should count how many items are valid (available and existent)
      checkItemsQuery = `SELECT COUNT(*) FROM items WHERE available = TRUE AND id IN (`;
      checkItemsValues = []
      itemsID.forEach(elem => {
        checkItemsQuery += `$${checkItemsValues.length + 1}, `;
        checkItemsValues.push(elem);
      })
      checkItemsQuery = checkItemsQuery.slice(0, -2) + ');';
      return db
        .query(checkItemsQuery, checkItemsValues)
        .then(res => {
          // after checking how many items are valid, we evaluate if the quantity is exactly the same as the different items present in an order
          if (Number(res.rows[0].count) === itemsID.length) {
            return resolve()
          }
          return reject('Some of the items are unavailable or not existing')
        })
    })
  }


  /* addOrder should react to a new order submission and update three tables: users, orders, and order_items
  expected input:
    { selectedItems: { item_id: quantity, item_id: quantity }, userDetails: { name: 'name', phone: 'phone' } }
  example:
    { selectedItems: { 1:3, 3:5 }, userDetails: { name: 'Danilo', phone: '1234567890' } }
  */
  const addOrder = obj => {
    const { selectedItems, userDetails } = obj;
    // query to insert a new user, returning its id
    let userID;
    const newUserQuery = {
      text: `
      INSERT INTO users (name, phone)
      VALUES ($1, $2) RETURNING id;
      `,
      values: [userDetails.name, userDetails.phone ? userDetails.phone.toString().replace(/\D/g, "") : '']
    }

    // the query text to insert a new order, returning its id
    let orderID;
    const newOrderQuery = `
      INSERT INTO orders (user_id)
      VALUES ($1) RETURNING id;
    `;

    // create a new let variable to hold the query text to create n rows in the order_items table, it will be updated with a for loop
    let assignItemsToOrderText = `INSERT INTO order_items (order_id, item_id, quantity)\nVALUES\n`;
    // define a itemsID array to later check if all the requested item_id are available and exist in our database
    const itemsID = [];
    // create an array to hold the values to the new query. It will be populated with a for loop and it will contain every pair of itemID and quantity
    const assignItemsToOrderValues = []
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
        // run the second query to create a new order related to the user_id that submitted the order
        return db.query(newOrderQuery, [userID]);
      })
      .then(res => {
        orderID = res.rows[0].id;
        // include the order_id as the first value in the values array
        assignItemsToOrderValues.unshift(orderID)
        // run the last query to create n rows in the order_items table
        return db.query(assignItemsToOrderText, assignItemsToOrderValues);
      })
      .catch(e => { throw e })
  }

  // evaluate if the order was accepted and change the accepted column accordingly
  const processOrder = obj => {
    const values = [obj.order_id];
    const accepted = obj.accepted !== undefined && obj.accepted === false ? false : true;
    values.push(accepted);
    const text =
      `
    UPDATE orders
    SET accepted = $2
    WHERE orders.id = $1
    RETURNING *
    `
    return db
      .query(text, values)
      .then(res => {
        if (res.rows[0]) {
          return 'The order acceptance was marked as ' + accepted
        }
        throw 'The order id does not exist'
      })
  }

  // mark the order as completed (change the completed_at column to now())
  const finishOrder = order_id => {
    query = {
      text: `
      UPDATE orders
      SET completed_at = now()
      WHERE orders.id = $1
      RETURNING *
      `,
      values: [order_id]
    }
    return db
      .query(query)
      .then(res => {
        if (res.rows[0]) {
          return 'The order was marked as completed'
        }
        throw 'The order id does not exist'
      })
  }

  return {
    getMenu,
    getNewOrders,
    getPendingOrders,
    getOrderDetails,
    getItemsFromOrder,
    addOrder,
    processOrder,
    finishOrder
  }
};
