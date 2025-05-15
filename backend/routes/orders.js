// ...existing code...
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

/**
 * @route   POST /api/orders
 * @desc    Create a new order (customer only)
 * @access  Private
 */
router.post('/', auth('customer'), async (req, res) => {
  try {
    const { shopkeeper, items, total } = req.body;
    const order = new Order({
      customer: req.user.id,
      shopkeeper,
      items,
      total
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/orders
 * @desc    Get orders for logged-in user
 * @access  Private
 */
router.get('/', auth(), async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'customer') {
      orders = await Order.find({ customer: req.user.id });
    } else if (req.user.role === 'shopkeeper') {
      orders = await Order.find({ shopkeeper: req.user.id });
    }
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status (shopkeeper only)
 * @access  Private
 */
router.put('/:id/status', auth('shopkeeper'), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, shopkeeper: req.user.id },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
// ...existing code...
