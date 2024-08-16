const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
let refreshTokens = [];

function createAccessToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "15s" });
}

function createRefreshToken(user) {
  return jwt.sign(user, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

function setRefreshTokens(tokens) {
  refreshTokens.push(tokens);
}

function removeAllRefreshToken(token) {
  refreshTokens = refreshTokens.filter((t) => t !== token);
}

// Refresh the access token and refresh token using the refresh token
router.post("/", (req, res) => {
  // const refreshToken = req.cookies.refreshToken;
  const refreshToken = req.body.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "You are not authenticated." });
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: "Refresh token is not valid." });
  }

  let payload = null;
  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: "You are not authenticated." });
    // filter out the current refresh token
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    req.user = decoded;
    payload = { ID: decoded.ID, role: decoded.role };
    if (decoded.role === "admin") {
      payload.admin_username = decoded.admin_username;
    } else {
      payload.email = decoded.email;
    }
    // Create new access token and refresh token
    const newAccessToken = createAccessToken(payload);
    const newRefreshToken = createRefreshToken(payload);
    // Add the new refresh token to the list of refresh tokens
    refreshTokens.push(newRefreshToken);
    res.send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  });
});

module.exports = {
  router,
  createAccessToken,
  createRefreshToken,
  setRefreshTokens,
  removeAllRefreshToken,
};
