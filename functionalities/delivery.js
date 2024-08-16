const express = require("express");
const router = express.Router();

const db = require("../db");

router.get("/:customer/:city", async (req, res) => {
  try {
    if (!parseInt(req.params.customer)) {
      return res.status(400).send("Invalid customer ID.");
    }
    const sql = `SELECT CalculateDeliveryDays(?, ?) AS days`;
    const [data] = await db.query(sql, [
      parseInt(req.params.customer),
      req.params.city,
    ]);
    res.send(data);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).send("Failed to calculate delivery days.");
  }
});

module.exports = router;
