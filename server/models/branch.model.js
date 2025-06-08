const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  location: { type: String, required: true },
  owner: { type: String, required: true },
  address: { type: String, required: true },
  openingDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  comment: { type: String },
  username: { type: String, required: true, unique: true }, // Will be set as name
  password: { type: String, required: true }, // Will be generated randomly
  email: { type: String, required: true } // Email to send credentials
});

module.exports = mongoose.model('Branch', BranchSchema);