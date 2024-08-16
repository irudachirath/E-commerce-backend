const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const db = require("../db");
const bcrypt = require("bcrypt");
const {
  createAccessToken,
  createRefreshToken,
  setRefreshTokens,
} = require("./token");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [data] = await db.query(
      "SELECT Customer_id, Hashed_password FROM customer WHERE email = ? AND is_registered = 1",
      [email]
    );
    if (data.length === 1) {
      const hashedPassword = data[0].Hashed_password;
      if (await bcrypt.compare(password, hashedPassword)) {
        const user = {
          email: email,
          role: "customer",
          ID: data[0].Customer_id,
        };
        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user);
        setRefreshTokens(refreshToken);
        res.json({
          message: "You're successfully logged in.",
          accessToken,
          refreshToken,
        });
      } else {
        res
          .status(401)
          .json({ message: "Incorrect password. Please try again." });
      }
    } else {
      res.status(404).json({ message: "User not found or not registered." });
    }
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
