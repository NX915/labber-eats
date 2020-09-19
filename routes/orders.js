/*
 * All routes for Orders are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  const dbHelpers = require('../db/dbHelpers')(db);

  router.get("/", (req, res) => {
    // {newOrders: [], pendingOrders: []}
    const output = {};
    dbHelpers.getNewOrders()
      .then(data => {
        output.newOrders = data;
        return dbHelpers.getPendingOrders();
      })
      .then(data => {
        output.pendingOrders = data;
        res.send(output);
      });
  });

  router.get("/:id", (req, res) => {
    // {orderItems: [], orderDetail: []}
    const output = {};
    dbHelpers.getOrderDetails(req.params.id)
      .then(data => {
        output.orderDetails = data;
        return dbHelpers.getItemsFromOrder(req.params.id);
      })
      .then(data => {
        output.itemsFromOrder = data;
        res.send(output);
      });
  });

  router.post('/', (req, res) =>{
    console.log(`posted to /orders`);
  });

  router.post("/:id", (req, res) => {
    res.send(`POST to orders/:${req.params.id}`);
    console.log(`POST to orders/:${req.params.id}`);
  });

  router.post("/:id/decline", (req, res) => {
    res.send(`POST to orders/:${req.params.id}/decline`);
    console.log(`POST to orders/:${req.params.id}/decline`);
  });

  return router;
};
