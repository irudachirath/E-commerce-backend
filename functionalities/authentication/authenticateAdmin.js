const jwt = require('jsonwebtoken');

function authenticateAdmin(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No token provided.' });
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err || decoded.role !== 'admin') {
        res.status(401).json({ message: 'Invalid token.' });
      } else {
        req.user = decoded;
        next();
      }
    });
  }
}

module.exports = authenticateAdmin;
