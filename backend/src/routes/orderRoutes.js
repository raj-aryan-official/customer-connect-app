const express = require('express');
const router = express.Router();
const {
  getOrders,
  createOrder,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getOrders);
router.post('/', protect, authorize('customer'), createOrder);
router.put('/:id/status', protect, authorize('shopkeeper'), updateOrderStatus);

module.exports = router;
