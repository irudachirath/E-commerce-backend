const express = require("express");
const router = express.Router(); // Use Router, not a new Express instance
const jwt = require("jsonwebtoken");

const db = require("../db");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const { admin_username, password } = req.body; // Assuming the client sends JSON data

  try {
    // First, retrieve the hashed password and customer ID from the database
    const [data] = await db.query(
      "SELECT Admin_id, Hashed_password FROM admin WHERE Admin_username = ?",
      [admin_username]
    );
    if (data.length === 1) {
      const hashedPassword = data[0].Hashed_password;

      // Compare the provided password with the stored hashed password
      const passwordMatch = await bcrypt.compare(password, hashedPassword);
      if (passwordMatch) {
        // Passwords match, admin is authenticated
        // Create a JWT token and send it to the client
        const token = jwt.sign(
          {
            admin_username: admin_username,
            role: "admin",
          },
          process.env.JWT_SECRET
        );
        res.json({
          message: "You're successfully logged in.",
          ID: data[0].Admin_id,
          token,
        });
      } else {
        res
          .status(401)
          .json({ message: "Incorrect password. Please try again." });
      }
    } else {
      res.status(404).json({ message: "admin not found or not registered." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
