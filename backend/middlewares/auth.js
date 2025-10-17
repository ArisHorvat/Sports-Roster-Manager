// middlewares/auth.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log("Auth header:", authHeader);

  const token = authHeader?.split(' ')[1];

  if (!token)
    return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    req.user = decoded;
    next(); // continue to route
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}

module.exports = { authenticateToken };
