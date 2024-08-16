const express = require("express");
const router = express.Router();

const db = require("../db");

router.get("/:id", async (req, res) => {
  try {
    const [details] = await db.query(
      `
    SELECT Name_on_Card, Card_Number, Expiry_Date FROM card_detail WHERE Customer_id = ?`,
      req.params.id
    );
    res.send(details);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).send("Failed to retrieve card details.");
  }
});

module.exports = router;
