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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
  },
  comment: {
    type: String,
  },
});

module.exports = mongoose.model('Revenue', revenueSchema);