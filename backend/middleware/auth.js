// JWT authentication middleware
const jwt = require('jsonwebtoken');

function auth(requiredRole) {
  return (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden: Insufficient role' });
      }
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
}

module.exports = auth;
