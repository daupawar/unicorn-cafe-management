const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branch.controller');
const authenticate = require('../middleware/authenticate');
const authorizeRole = require('../middleware/authorizeRole');

// Only admin can add/edit/delete branches
router.post('/', authenticate, authorizeRole('admin'), branchController.addBranch);
router.put('/:id', authenticate, authorizeRole('admin'), branchController.editBranch);
router.delete('/:id', authenticate, authorizeRole('admin'), branchController.deleteBranch);

// Anyone logged in can view branches
router.get('/', authenticate, branchController.getBranches);

module.exports = router;