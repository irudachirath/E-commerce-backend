const jwt = require("jsonwebtoken");

function authenticateUser(req, res, next) {
  const authHeader = req.header("authorization");
  const token = authHeader && authHeader.split(" ")[1];
  console.log(token);

  if (!token) {
    res.status(401).json({ message: "No token provided." });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: "Invalid token." });
      } else {
        req.user = decoded;
        next();
      }
    });
  }
}

module.exports = authenticateUser;
