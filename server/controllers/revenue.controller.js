const Expense = require('../models/expense.model');
 

exports.addRevenue = async (req, res) => {
  try {
    const { date, revenue, reason } = req.body;
    if (!date || typeof revenue !== 'number') {
      return res.status(400).json({ message: 'Date and revenue are required.' });
    }
    const revenueEntry = new Expense({
      date,
      revenue,
      expenses: 0,
      reason: reason || 'Revenue Entry'
    });
    await revenueEntry.save();
    res.status(201).json(revenueEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllRevenue = async (req, res) => {
  try {
    const revenues = await Expense.find({ revenue: { $gt: 0 }, expenses: 0 }).sort({ date: -1 });
    res.json(revenues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getRevenueByDate = async (req, res) => {
  try {
    let { day, month, year } = req.query;
    let query = { revenue: { $gt: 0 }, expenses: 0 };

    if (day && month && year) {
      const start = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00.000Z`);
      const end = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T23:59:59.999Z`);
      query.date = { $gte: start, $lte: end };
    } else if (month && year) {
      const start = new Date(`${year}-${month.padStart(2, '0')}-01T00:00:00.000Z`);
      const end = new Date(`${year}-${month.padStart(2, '0')}-31T23:59:59.999Z`);
      query.date = { $gte: start, $lte: end };
    } else if (year) {
      const start = new Date(`${year}-01-01T00:00:00.000Z`);
      const end = new Date(`${year}-12-31T23:59:59.999Z`);
      query.date = { $gte: start, $lte: end };
    } else if (day) {
      query = {
        ...query,
        $expr: { $eq: [{ $dayOfMonth: "$date" }, Number(day)] }
      };
    } else {
      return res.status(400).json({ message: 'Provide at least one of day, month, or year.' });
    }

    const revenues = await Expense.find(query).sort({ date: 1 }).select('date revenue');
    const totalRevenue = revenues.reduce((sum, rev) => sum + (rev.revenue || 0), 0);

    res.json({ revenues, totalRevenue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};