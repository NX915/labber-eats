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
    dbHelpers.getNewOrders()
      .then(orders => res.send(orders));
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
