// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = (role) => async (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    if (role && req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
    // Optionally, fetch user from DB
    req.userDoc = await User.findById(req.user.id);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
