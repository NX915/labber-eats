
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
      .query('SELECT id FROM orders WHERE accepted IS NULL')
      .then(res => res.rows);
  }

  // returns all new orders id as an array
  const getPendingOrders = () => {
    return db
      .query('SELECT id FROM orders WHERE accepted = TRUE AND completed_at IS NULL')
      .then(res => res.rows);
  }

  // returns an object with the order details
  const getOrderDetails = order_id => {
    query = {
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
    query = {
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


  // add an order (it should change the users)
  const addOrder = order => {
    query = {
      text: `
        INSERT INTO users (name, phone)
        VALUES ($1, $2) RETURNING *;
      `,
      values: [user.name, user.phone]
    }
    return db
      .query(query)
      .then(res => res.rows)
  }

  return {
    getMenu,
    getNewOrders,
    getPendingOrders,
    getOrderDetails,
    getItemsFromOrder,
    addOrder
  }
};
