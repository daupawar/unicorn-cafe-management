const express = require('express');
const router = express.Router();
const revenueController = require('../controllers/revenue.controller');

router.post('/', revenueController.addRevenue);
router.get('/', revenueController.getAllRevenue);
router.put('/:id', revenueController.editRevenue); // <-- Add this line for editing revenue
router.delete('/:id', revenueController.deleteRevenue);
router.get('/by-date', revenueController.getRevenueByDate);

module.exports = router;