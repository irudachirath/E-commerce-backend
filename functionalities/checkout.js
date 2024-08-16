const express = require("express");
const router = express.Router();

const db = require("../db");

router.get("/:id", async (req, res) => {
  try {
    const [details] = await db.query(
      `
        SELECT First_name, Last_name, Email, Phone_number, Address_line1, Address_line2, City, Province, Zipcode
        FROM customer
        WHERE Customer_id = ? AND Is_registered = 1;`,
      [req.params.id]
    );
    res.send(details);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).send("Failed to fetch checkout details.");
  }
});

module.exports = router;
