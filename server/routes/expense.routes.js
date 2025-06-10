const express = require('express');
const router = express.Router();
const Expense = require('../models/expense.model'); // Adjust the path as necessary
const multer = require('multer');
const XLSX = require('xlsx');
const upload = multer({ dest: 'uploads/' });
const axios = require('axios');
const cors = require('cors');
const app = express();
const { GoogleGenerativeAI } = require('@google/generative-ai');


app.use(cors()); 
// Add new expense
router.post('/', async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Edit expense
router.put('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Bulk upload expenses from Excel
router.post('/bulk-upload', upload.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Get raw rows

    // data[0] = [ '', '01-05-2025', '02-05-2025', ... ]
    // data[1] = [ 'Revenue', 5528, 4467, ... ]
    // data[2] = [ 'Expenses', 2370, 1950, ... ]
    // data[3] = [ 'Reason For Expenses', 'milk(30),sakhr(420)', 'milk(30)', ... ]

    const dates = data[0].slice(1); // skip first empty cell
    const revenueRow = data.find(row => row[0] === 'Revenue');
    const expensesRow = data.find(row => row[0] === 'Expenses');
    const reasonRow = data.find(row => row[0] === 'Reason For Expenses');

    const expenses = [];
    let skipped = 0;

    dates.forEach((date, idx) => {
      const revenue = Number(revenueRow[idx + 1]);
      const expensesValue = Number(expensesRow[idx + 1]);
      const reason = reasonRow ? reasonRow[idx + 1] : '';

      if (!date || isNaN(revenue) || isNaN(expensesValue)) {
        skipped++;
        console.log('Skipping:', { date, revenue, expensesValue, reason });
        return;
      }

      let jsDate;
      if (typeof date === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(date)) {
        // Strictly match DD-MM-YYYY
        const [day, month, year] = date.split('-');
        jsDate = new Date(`${year}-${month}-${day}`);
      } else if (!isNaN(date)) {
        // Excel serial date number
        jsDate = new Date(Date.UTC(1899, 11, 30) + (date * 86400000));
      } else {
        jsDate = new Date(date);
      }

      expenses.push({
        date: jsDate,
        revenue,
        expenses: expensesValue,
        reason: reason || ''
      });
    });

    if (expenses.length > 0) {
      await Expense.insertMany(expenses);
    }
    res.json({ message: 'Bulk upload successful', added: expenses.length, skipped });
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ message: error.message });
  }
});

require('dotenv').config(); // Add this at the top if not already

router.get('/by-date', async (req, res) => {
  try {
    let { day, month, year } = req.query;
    let query = {};

    if (day && month && year) {
      // Specific day
      const start = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00.000Z`);
      const end = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T23:59:59.999Z`);
      query.date = { $gte: start, $lte: end };
    } else if (month && year) {
      // Whole month
      const start = new Date(`${year}-${month.padStart(2, '0')}-01T00:00:00.000Z`);
      const end = new Date(`${year}-${month.padStart(2, '0')}-31T23:59:59.999Z`);
      query.date = { $gte: start, $lte: end };
    } else if (year) {
      // Whole year
      const start = new Date(`${year}-01-01T00:00:00.000Z`);
      const end = new Date(`${year}-12-31T23:59:59.999Z`);
      query.date = { $gte: start, $lte: end };
    } else if (day) {
      // All expenses on this day (any month/year)
      query = {
        $expr: { $eq: [{ $dayOfMonth: "$date" }, Number(day)] }
      };
    } else {
      return res.status(400).json({ message: 'Provide at least one of day, month, or year.' });
    }

    // Only select date, amount, reason
    const expenses = await Expense.find(query)
      .sort({ date: 1 })
      .select('date amount reason');

    // Calculate total amount
    const totalAmount = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

    res.json({ expenses, totalAmount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
 
module.exports = router;