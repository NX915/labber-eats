
//still need to change server to import this file and while doing so, pass the db parameter. Is that how we are supposed to do so we don't need to connect to our db again
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
      .then(res => res.rows[0]);
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
      .then(res => res.rows);
  }


  /* should react to a new order submission and update three tables:

    users: create a new row with name and phone. The id created by the database should be saved in a variable so we can use it to insert a row in the orders table

    orders: create a new row only with the user_id (id, estimated_wait, accepted, created_at and completed_at should not be filled right now)

    order_items: create n rows where n is the number of distinct items. Should populate the row with the order_id, the item_id and quantity)

    expected input:
      {
        selectedItems: { item_id: quantity, item_id: quantity },
        userDetails: { name: 'name', phone: 'phone' }
      }
    example:
      {
        selectedItems: { 1:3, 3:5 },
        userDetails: { name: 'Danilo', phone: '1234567890' }
      }

 */
  const checkErrors = obj => {
    const { selectedItems, userDetails } = obj;
    console.log(obj);
    return new Promise((resolve, reject) => {

      // confirming that the user has selected at least one item (not an empty object)
      if (Object.keys(selectedItems).length === 0) {
        console.log('invalid selection')
        return reject('It seems that the user did not select any item');
      }
      // confirming that both the name and phone fields are filled
      if (!userDetails.name) {
        console.log('invalid name')
        return reject('The name field does not contain a valid input');
      }
      if (!userDetails.phone || toString(userDetails.phone).length < 10) {
        console.log('invalid phone number')
        return reject('The phone number is either empty or incomplete');
      }
      return resolve();
    })

  }

  const addOrder = obj => {
    const { selectedItems, userDetails } = obj;
    // query to insert a new user, returning its id
    let userID;
    const newUserQuery = {
      text: `
      INSERT INTO users (name, phone)
      VALUES ($1, $2) RETURNING id;
      `,
      values: [userDetails.name, userDetails.phone]
    }

    // the query text to insert a new order, returning its id
    let orderID;
    const newOrderQuery = `
      INSERT INTO orders (user_id)
      VALUES ($1) RETURNING id;
    `;

    // create a new let variable to hold the query text to create n rows in the order_items table, it will be updated with a for loop
    let assignItemsToOrderText = `INSERT INTO order_items (order_id, item_id, quantity)\nVALUES\n`;
    // define a itemsID array to later check if all the requested item_id are available (will not check if it exists, because if it doesn't, the database will throw an error because it will violate foreign key constraint: item_id is not present in table items)
    const itemsID = [];
    // create an array to hold the values to the new query. It will be populated with a for loop
    const assignItemsToOrderValues = []
    for (const itemID in selectedItems) {
      itemsID.push(itemID);
      // confirming that every item has a valid quantity
      if (selectedItems[itemID] <= 0) {
        throw 'It seems that not all of the selected quantities are valid'
      }
      assignItemsToOrderText += `($1, $${assignItemsToOrderValues.length + 2}, $${assignItemsToOrderValues.length + 3}),\n`;
      assignItemsToOrderValues.push(itemID);
      assignItemsToOrderValues.push(selectedItems[itemID]);
    }
    // delete the last row extra new line and comma, and add the command to finish the query
    assignItemsToOrderText = assignItemsToOrderText.slice(0, -2) + ';';

    // create a new query to check if every item_id in the order is valid
    console.log(itemsID);
    // checkItemsQuery = {
    //   text: `
    //   SELECT id FROM items WHERE available = TRUE
    //   `,
    //   values: []
    // }


    // check if the obj is invalid
    return checkErrors(obj)
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
      .catch(e => e)
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
          return console.log(obj.order_id, 'was marked as', accepted)
        }
        throw 'The order id doesn\'t exist'
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
          return console.log(order_id, 'was marked as completed')
        }
        throw 'The order id doesn\'t exist'
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
