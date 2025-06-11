const mongoose = require('mongoose');

const revenueSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  branch: {
    type: String,
    ref: 'Branch',
  },
  comment: {
    type: String,
  },
});

module.exports = mongoose.model('Revenue', revenueSchema);