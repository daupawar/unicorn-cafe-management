const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  amount: { type: Number, required: true }, // Use 'amount' for expense value
  reason: { type: String } ,// Reason For Expenses
   branch: { type: String, required: true }
});

module.exports = mongoose.model('Expense', ExpenseSchema);