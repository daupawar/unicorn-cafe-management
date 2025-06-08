const Branch = require('../models/branch.model');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
// Add branch

// Add branch
exports.addBranch = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admin can add/edit/delete branch' });
  }
  try {
    // Generate random password
    const randomPassword = crypto.randomBytes(6).toString('hex');

    // Prepare branch data
    const branchData = {
      ...req.body,
      username: req.body.name, // username is branch name
      password: randomPassword // store plain password or hash as needed
    };

    const branch = new Branch(branchData);
    await branch.save();

    // Return credentials in the API response
    res.status(201).json({
      branch,
      credentials: {
        username: branch.username,
        password: randomPassword
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Edit branch
exports.editBranch = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admin can add/edit/delete branch' });
  }
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!branch) return res.status(404).json({ error: 'Branch not found' });
    res.json(branch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete branch
exports.deleteBranch = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admin can add/edit/delete branch' });
  }
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) return res.status(404).json({ error: 'Branch not found' });
    res.json({ message: 'Branch deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// (Optional) Get all branches
exports.getBranches = async (req, res) => {
  const branches = await Branch.find();
  res.json(branches);
};