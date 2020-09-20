// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();
const dbHelpers = require('./db/dbHelpers')(db);

// -----------------      dbHelpers tests         ---------------------

// dbHelpers.getMenu()
// .then(res => console.log('menu', res));

// dbHelpers.getNewOrders()
// .then(res => console.log('new orders:', res));

// dbHelpers.getPendingOrders()
// .then(res => console.log('pending orders:',res));

// dbHelpers.getOrderDetails(1)
// .then(res => console.log('order details:', res));

// dbHelpers.getItemsFromOrder(1)
// .then(res => console.log('items from order:', res));

// // ok
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 3:5 },
//   userDetails: { name: 'Danilo', phone: 1234567890 }
// })
// .catch(e => console.log(e.message));
// // ok
// dbHelpers.addOrder({
//   selectedItems: { 2:1, 3:1 },
//   userDetails: { name: 'Sara', phone: '+1(234)567-8910' }
// })
// .catch(e => console.log(e.message));
// // ok
// dbHelpers.addOrder({
//   selectedItems: { 2:1, 3:0 },
//   userDetails: { name: 'Selected item < 0', phone: '+1(234)567-8910' }
// })
// .catch(e => console.log(e.message));
// // ok
// dbHelpers.addOrder({
//   selectedItems: {},
//   userDetails: { name: 'invalid selection', phone: 1234567890 }
// })
// .catch(e => console.log(e.message));
// // ok
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 3:5 },
//   userDetails: { name: '', phone: 1234567890 }
// })
// .catch(e => console.log(e.message));
// // ok
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 3:5 },
//   userDetails: { name: 'absent phone' }
// })
// .catch(e => console.log(e.message));
// // ok
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 3:5 },
//   userDetails: { name: 'invalid phone', phone: 123456789 }
// })
// .catch(e => console.log(e.message));
// // ok
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 4:5 },
//   userDetails: { name: 'phone as a big string', phone: 'i dont want to inform my phone' }
// })
// .catch(e => console.log(e.message));
// // ok
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 4:5 },
//   userDetails: { name: 'numberIsToLong', phone: '+1(234)567-8951234567895123456789512' }
// })
// .catch(e => console.log(e.message));
// // ok
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 4:5 },
//   userDetails: { name: 'unavailable item', phone: 1234567890 }
// })
// .catch(e => console.log(e.message));
// // ok
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 5:5 },
//   userDetails: { name: 'non existing item', phone: 1234567890 }
// })
// .catch(e => console.log(e.message));


// dbHelpers.processOrder({order_id: 1}) // should be accepted
// .then(res => res)
// dbHelpers.processOrder({order_id: 2, accepted: 'anything'}) // should be accepted
// .then(res => res)
// dbHelpers.processOrder({order_id: 3, accepted: false}) // should be rejected
// .then(res => res)
// dbHelpers.processOrder({order_id: 4, accepted: ''}) // should be accepted
// .then(res => res)
// dbHelpers.finishOrder(6)
// .then(res => res)


// -----------------      dbHelpers tests         ---------------------


// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const itemsRoutes = require("./routes/items");
// const usersRoutes = require("./routes/users");
// const widgetsRoutes = require("./routes/widgets");
const ordersRoutes = require("./routes/orders");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/items", itemsRoutes(db));
// app.use("/api/users", usersRoutes(db));
// app.use("/api/widgets", widgetsRoutes(db));
app.use("/orders", ordersRoutes(db));
// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/control", (req, res) => {
  res.render("control");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
