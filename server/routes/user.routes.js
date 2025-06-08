const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorizeRole = require('../middleware/authorizeRole');
const User = require('../models/user.model');

// Get current user info
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Only manager can get all users
router.get('/all', authenticate, authorizeRole('manager'), async (req, res) => {
  const users = await User.find({}, '-password');
  res.json(users);
});

module.exports = router;