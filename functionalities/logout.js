const express = require("express");
const router = express.Router();

const { removeAllRefreshToken } = require("./token");

router.post("/", (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "You are not authenticated." });

  try {
    removeAllRefreshToken(refreshToken);
    res.status(200).json({ message: "You are logged out." });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
