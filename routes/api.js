/* -------------------------------------------------------------------------- */
/*                                 API Routes                                 */
/* -------------------------------------------------------------------------- */

/* --------------------------- Import Dependencies -------------------------- */

  const router = require("express").Router();
  const Transaction = require("../models/transaction.js");

/* -------------------- Define Routes For DB Interaction -------------------- */

  // Post a new transaction to the mongo db
  router.post("/api/transaction", ({body}, res) => {
    Transaction.create(body)
      .then(dbTransaction => {
        res.json(dbTransaction);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  });

  // Post multiple new transactions to the mongo db (coming from indexedDB)
  router.post("/api/transaction/bulk", ({body}, res) => {
    Transaction.insertMany(body)
      .then(dbTransaction => {
        res.json(dbTransaction);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  });

  // Retrieve all transactions from the mongo db
  router.get("/api/transaction", (req, res) => {
    Transaction.find({}).sort({date: -1})
      .then(dbTransaction => {
        res.json(dbTransaction);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  });

/* -------------------- Export Routes For Use on serverjs ------------------- */
  
  module.exports = router;