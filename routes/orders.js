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
    console.log(req.body);
    console.log(`HELLOOOOO`);
  });

  router.post("/:id", (req, res) => {
    const { id } = req.params;

    dbHelpers.processOrder({order_id: id})
      .then(() => {
        res.status(200).send(`Successful POST to orders/${id}`);
      })
      .catch((err) => {
        res.status(404).send(`Unsuccessful POST to orders/${id} ${err.message}`);
      });
  });

  router.post("/:id/decline", (req, res) => {
    const { id } = req.params;

    dbHelpers.processOrder({order_id: id, accepted: false})
      .then(() => {
        res.send(`Successful POST to orders/${id}/decline`);
      })
      .catch((err) => {
        res.send(`Unsuccessful POST to orders/${id}/decline ${err.message}`);
      });
  });

  router.post("/:id/done", (req, res) => {
    const { id } = req.params;

    dbHelpers.finishOrder(id)
      .then(() => {
        res.send(`Successful POST to orders/:${req.params.id}/done`);
      })
      .catch(err => res.send(`Unsuccessful POST to orders/${id}/done ${err.message}`));
  });

  return router;
};
