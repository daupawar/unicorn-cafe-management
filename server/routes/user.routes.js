const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const authorizeRole = require('../middleware/authorizeRole');

const User = require('../models/user.model');
const Branch = require('../models/branch.model');
const Expense = require('../models/expense.model');
const Revenue = require('../models/summery.model');

// Get current user info
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Only manager can get all users
router.get('/all', authenticate, authorizeRole('manager'), async (req, res) => {
  const users = await User.find({}, '-password');
  res.json(users);
});


router.get('/summary', async (req, res) => {
  try {
    const [userCount, branchCount, expenseCount, totalExpenses, totalProfit] = await Promise.all([
      User.countDocuments(),
      Branch.countDocuments(),
      Expense.countDocuments(),
      Expense.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
      Revenue.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
    ]);
    res.json({
      users: userCount,
      branches: branchCount,
      grandTotalExpenses: totalExpenses[0]?.total || 0,
      grandTotalProfit: totalProfit[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;