const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const db = require("../db");

router.post("/", async (req, res) => {
  const sql1 = `SELECT Customer_id FROM customer WHERE Email = ? AND Is_registered = 1`;
  try {
    const [details1] = await db.query(sql1, req.body.Email);
    if (details1.length > 0) {
      res.send("You're already registered. Please log in.");
    } else {
      const hashedPassword = await bcrypt.hash(req.body.Password, 10);
      const values = [
        hashedPassword,
        req.body.First_name,
        req.body.Last_name,
        req.body.Email,
        req.body.Phone_number,
        req.body.Address_line1,
        req.body.Address_line2,
        req.body.City,
        req.body.Province,
        req.body.Zipcode,
        1,
      ];
      await db.query(
        "INSERT INTO customer (Hashed_password, First_name, Last_name, Email, Phone_number, Address_line1, Address_line2, City, Province, Zipcode, Is_registered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)",
        values
      );
      res.send("Registration succeeded.");
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send("An error occurred.");
  }
});

module.exports = router;
