const express = require('express');
const router = express.Router();
const revenueController = require('../controllers/revenue.controller');

router.post('/', revenueController.addRevenue);
router.get('/', revenueController.getAllRevenue);

// Add this route for /by-date
router.get('/by-date', revenueController.getRevenueByDate);

module.exports = router;