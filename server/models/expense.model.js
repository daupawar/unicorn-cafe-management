const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  revenue: { type: Number, required: true },
  expenses: { type: Number, required: true },
  reason: { type: String } // Reason For Expenses
});

module.exports = mongoose.model('Expense', ExpenseSchema);