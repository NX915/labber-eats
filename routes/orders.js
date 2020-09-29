/*
 * All routes for Orders are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const { sendSMSToUser, sendSMSToRestaurant } = require('../sms/smsHelpers');

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

  router.post('/', (req, res) => {
    const orderDetails = req.body;
    dbHelpers.addOrder(orderDetails);
    res.json('ok');
    sendSMSToRestaurant('You have received a new order!');
  });

  router.post("/:id", (req, res) => {
    const { id } = req.params;
    const { input } = req.body;
    console.log('accept order input', input);
    dbHelpers.processOrder({ order_id: id, input })
      .then(() => {
        res.status(200).send(`Successful POST to orders/${id}`);
      })
      .catch((err) => {
        res.status(404).send(`Unsuccessful POST to orders/${id} ${err.message}`);
      });
    dbHelpers.getOrderDetails(id)
      .then(res => {
        const { phone, estimated_wait } = res;
        const obj = { id, phone, type: 'confirmed', input, estimated_wait }
        sendSMSToUser(obj);
      });
  });

  router.post("/:id/decline", (req, res) => {
    const { id } = req.params;
    const { input } = req.body;
    console.log('decline order input', input);
    dbHelpers.processOrder({ order_id: id, accepted: false })
      .then(() => {
        res.send(`Successful POST to orders/${id}/decline`);
      })
      .catch((err) => {
        res.send(`Unsuccessful POST to orders/${id}/decline ${err.message}`);
      });
    dbHelpers.getOrderDetails(id)
      .then(res => {
        const { phone } = res;
        const obj = { id, phone, type: 'declined', input }
        sendSMSToUser(obj);
      });
  });

  router.post("/:id/ready", (req, res) => {
    const { id } = req.params;
    const { input } = req.body;
    let obj;
    console.log('ready order input', input)
    dbHelpers.getOrderDetails(id)
      .then(res => {
        const { phone, accepted_at } = res;
        obj = { id, phone, type: 'ready', input }
        if (accepted_at === null) {
          return dbHelpers.processOrder({ order_id: id, input: 0 });
        }
      })
      .then(() => dbHelpers.readyAt(id))
      .then(() => sendSMSToUser(obj))
      .then(() => {
        res.send(`Successful POST to orders/:${req.params.id}/ready`);
      })
      .catch(err => res.send(`Unsuccessful POST to orders/${id}/ready ${err.message}`));
  });

  router.post("/:id/done", (req, res) => {
    const { id } = req.params;
    const { input } = req.body;
    console.log('complete order input', input);
    dbHelpers.getOrderDetails(id)
      .then(res => {
        const { ready_at } = res;
        if (ready_at === null) {
          return dbHelpers.readyAt(id)
        }
      })
      .then(() => dbHelpers.finishOrder(id))
      .then(() => {
        res.send(`Successful POST to orders/:${req.params.id}/done`);
      })
      .catch(err => res.send(`Unsuccessful POST to orders/${id}/done ${err.message}`));
  });

  return router;
};
