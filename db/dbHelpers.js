
//still need to change server to import this file and while doing so, pass the db parameter. Is that how we are supposed to do so we don't need to connect to our db again
module.exports = db => {

  // gets all available items to be displayed to the user. It returns an array
  const getMenu = () => {
    return db
      .query('SELECT * FROM items')
      .then(res => res.rows)
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
      .then(res => res.rows[0])
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
      .then(res => res.rows)
  }


  /* should react to a new order submission and update three tables:

    users: create a new row with name and phone. The id created by the database should be saved in a variable so we can use it to insert a row in the orders table

    orders: create a new row only with the user_id (id, estimated_wait, accepted, created_at and completed_at should not be filled right now)

    order_items: create n rows where n is the number of distinct items. Should populate the row with the order_id, the item_id and quantity)

    expected input:
    selectedItems = { item_id: quantity, item_id: quantity }
    selectedItems = { 1: 3, 4: 1 }
    userDetails = { name, phone }
    we need to make sure that the selectedItems has at least one item selected (not an empty object)
    we need to make sure that the user can only submit an order if both the name and phone fields are filled
 */
  const addOrder = obj => {
    const { selectedItems, userDetails } = obj;

    // define userID and orderID variables to hold the ids of the new created rows
    let userID;
    let orderID;
    // query to insert a new user, returning its id
    const newUserQuery = {
      text: `
        INSERT INTO users (name, phone)
        VALUES ($1, $2) RETURNING id;
      `,
      values: [userDetails.name, userDetails.phone]
    }
    // the query text to insert a new order, returning its id
    const newOrderQuery = `
      INSERT INTO orders (user_id)
      VALUES ($1) RETURNING id;
    `;
    // create a new let variable to hold the query text to create n rows in the order_items table, it will be updated with a for loop
    let assignItemsToOrderText = `INSERT INTO order_items (order_id, item_id, quantity)\nVALUES\n`;
    // create an array to hold the values to the new query. It will be populated with a for loop
    const assignItemsToOrderValues = []
    for (const itemID in selectedItems) {
      assignItemsToOrderText += `($1, $${assignItemsToOrderValues.length + 2}, $${assignItemsToOrderValues.length + 3}),\n`;
      assignItemsToOrderValues.push(itemID);
      assignItemsToOrderValues.push(selectedItems[itemID]);
    }
    // delete the last row extra new line and comma and add the command to finish the query
    assignItemsToOrderText = assignItemsToOrderText.slice(0, -2) + ';';
    // run the first query that will return the user_id
    return db
      .query(newUserQuery)
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
    `
    return db
      .query(text, values)
      .then(() => console.log(obj.order_id, 'was marked as', accepted))
  }

  // mark the order as completed (change the completed_at column to now())
  const finishOrder = order_id => {
    query = {
      text: `
      UPDATE orders
      SET completed_at = now()
      WHERE orders.id = $1
      `,
      values: [order_id]
    }
    return db
      .query(query)
      .then(() => console.log(order_id, 'was marked as completed'))
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
