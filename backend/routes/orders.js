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

/**
 * @route   PUT /api/orders/:id/approve
 * @desc    Approve or reject shopkeeper-modified order (customer only)
 * @access  Private
 */
router.put('/:id/approve', auth('customer'), async (req, res) => {
  try {
    const { approve } = req.body; // approve: true/false
    const order = await Order.findOne({ _id: req.params.id, customer: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'approved' && order.status !== 'pending') {
      return res.status(400).json({ message: 'Order cannot be approved/rejected at this stage' });
    }
    order.status = approve ? 'approved' : 'rejected';
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   DELETE /api/orders/:id
 * @desc    Cancel an order (customer only, if not packed)
 * @access  Private
 */
router.delete('/:id', auth('customer'), async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, customer: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (['packed', 'completed'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel packed or completed orders' });
    }
    await order.deleteOne();
    res.json({ message: 'Order cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   PUT /api/orders/:id/payment
 * @desc    Update payment status (shopkeeper only)
 * @access  Private
 */
router.put('/:id/payment', auth('shopkeeper'), async (req, res) => {
  try {
    const { paymentStatus } = req.body; // 'paid' or 'failed'
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, shopkeeper: req.user.id },
      { paymentStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   GET /api/orders/history
 * @desc    Get order history with optional status/date filter
 * @access  Private
 */
router.get('/history', auth(), async (req, res) => {
  try {
    const { status, from, to } = req.query;
    let query = {};
    if (req.user.role === 'customer') query.customer = req.user.id;
    if (req.user.role === 'shopkeeper') query.shopkeeper = req.user.id;
    if (status) query.status = status;
    if (from || to) query.createdAt = {};
    if (from) query.createdAt.$gte = new Date(from);
    if (to) query.createdAt.$lte = new Date(to);
    const orders = await Order.find(query);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
