const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const tokenWithRole = authHeader.split(' ')[1];
  const [token, role] = tokenWithRole.split('|');
  // You can now check the role and token as needed
  req.user = { role, token };
  next();
};