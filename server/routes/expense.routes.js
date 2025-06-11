const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
  const expenseController = require('../controllers/expense.controller'); // Corrected import path     

// Add new expense
router.post('/', expenseController.addExpense);

// Get all expenses
router.get('/', expenseController.getAllExpenses);

// Edit expense
router.put('/:id', expenseController.editExpense);

// Delete expense
router.delete('/:id', expenseController.deleteExpense);

// Bulk upload expenses from Excel
router.post('/bulk-upload', upload.single('file'), expenseController.bulkUploadExpenses);

// Get expenses by date
router.get('/by-date', expenseController.getExpensesByDate);

module.exports = router;