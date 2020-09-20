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

// // ok --> should add to db
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 3:5 },
//   userDetails: { name: 'Danilo', phone: 1234567890 }
// })
// .catch(e => console.log('outside dbHelpers (should not have an error):', e));

// // ok --> should add to db
// dbHelpers.addOrder({
//   selectedItems: { 2:1, 3:1 },
//   userDetails: { name: 'Sara', phone: '+1(234)567-8910' }
// })
// .catch(e => console.log('outside dbHelpers (should not have an error):', e));

// // ok --> should return an error: it seems that not all of the selected quantities are valid
// dbHelpers.addOrder({
//   selectedItems: { 2:1, 3:0 },
//   userDetails: { name: 'Selected item < 0', phone: '+1(234)567-8910' }
// })
// .catch(e => console.log('outside dbHelpers(q < 0):', e));

// // ok --> should return an error: it seems that no item has been selected
// dbHelpers.addOrder({
//   selectedItems: {},
//   userDetails: { name: 'invalid selection', phone: 1234567890 }
// })
// .catch(e => console.log('outside dbHelpers (no item selected):', e));

// // ok --> should return an error: The name field does not contain a valid input
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 3:5 },
//   userDetails: { name: '', phone: 1234567890 }
// })
// .catch(e => console.log('outside dbHelpers (name is not a valid input):', e));

// // ok --> should return an error: The phone number is empty
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 3:5 },
//   userDetails: { name: 'absent phone' }
// })
// .catch(e => console.log('outside dbHelpers (no phone):', e));

// // ok --> should return an error: The phone number incomplete
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 3:5 },
//   userDetails: { name: 'invalid phone', phone: 123456789 }
// })
// .catch(e => console.log('outside dbHelpers (incomplete phone):', e));

// // ok --> should return an error: The phone number is invalid
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 4:5 },
//   userDetails: { name: 'phone as a big string', phone: 'I don\'t want to inform my phone' }
// })
// .catch(e => console.log('outside dbHelpers (string as phone):', e));

// // ok --> should return an error: The phone number is longer than expected
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 4:5 },
//   userDetails: { name: 'numberIsToLong', phone: '+1(234)567-8951234567895123456789512' }
// })
// .catch(e => console.log('outside dbHelpers (phone too long):', e));

// // ok --> should return an error: unavailable item
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 4:5 },
//   userDetails: { name: 'unavailable item', phone: 1234567890 }
// })
// .catch(e => console.log('outside dbHelpers (unavailable item):', e));

// // ok --> should return an error: non existing item
// dbHelpers.addOrder({
//   selectedItems: { 1:3, 5:5 },
//   userDetails: { name: 'non existing item', phone: 1234567890 }
// })
// .catch(e => console.log('outside dbHelpers (non existing item):', e));


// dbHelpers.processOrder({order_id: 1}) // should be accepted
// .then(res => console.log('outside then response for processing order 1:',res))
// .catch(e => console.log('outside catch response for processing order 1:',e))
// dbHelpers.processOrder({order_id: 2, accepted: 'anything'}) // should be accepted
// .then(res => console.log('outside then response for processing order 2:',res))
// .catch(e => console.log('outside catch response for processing order 2:',e))

// dbHelpers.processOrder({order_id: 3, accepted: false}) // should be rejected
// .then(res => console.log('outside then response for processing order 3:',res))
// .catch(e => console.log('outside catch response for processing order 3:',e))

// dbHelpers.processOrder({order_id: 4, accepted: ''}) // should be accepted
// .then(res => console.log('outside then response for processing order 4:',res))
// .catch(e => console.log('outside catch response for processing order 4:',e))

// dbHelpers.processOrder({order_id: 13, accepted: ''}) // should return an error
// .then(res => console.log('outside then response for processing order 13:',res))
// .catch(e => console.log('outside catch response for processing order 13:',e))

// dbHelpers.finishOrder(6)
// .then(res => console.log('outside then response for finishing order 6:', res))
// .catch(e => console.log('outside catch response for finishing order 6:',e))

// dbHelpers.finishOrder(13)
// .then(res => console.log('outside then response for finishing order 13:', res))
// .catch(e => console.log('outside catch response for finishing order 13:',e))



// -----------------      dbHelpers tests         ---------------------


// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
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
