const Revenue = require('../models/revenue.model');

exports.addRevenue = async (req, res) => {
  try {
    const { date, amount } = req.body;
    if (!date || typeof amount !== 'number') {
      return res.status(400).json({ message: 'Date and amount are required.' });
    }
    const revenueEntry = new Revenue({
      date,
      amount
    });
    await revenueEntry.save();
    res.status(201).json(revenueEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllRevenue = async (req, res) => {
  try {
    const revenues = await Revenue.find().sort({ date: -1 });
    res.json(revenues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRevenueByDate = async (req, res) => {
  try {
    let { day, month, year } = req.query;
    let query = {};

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

    const revenues = await Revenue.find(query).sort({ date: 1 }).select('date amount');
    const totalRevenue = revenues.reduce((sum, rev) => sum + (rev.amount || 0), 0);

    res.json({ revenues, totalRevenue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add this to revenue.controller.js
exports.deleteRevenue = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Revenue.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Revenue not found' });
    }
    res.json({ message: 'Revenue deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editRevenue = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, amount } = req.body;
    const updated = await Revenue.findByIdAndUpdate(
      id,
      { date, amount },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Revenue not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};