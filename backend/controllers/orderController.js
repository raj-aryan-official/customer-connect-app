// backend/controllers/orderController.js
const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
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
};

exports.getOrders = async (req, res) => {
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
};

exports.updateOrderStatus = async (req, res) => {
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
};

exports.approveOrder = async (req, res) => {
  try {
    const { approve } = req.body;
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
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, customer: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (["packed", "completed"].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel packed or completed orders' });
    }
    await order.deleteOne();
    res.json({ message: 'Order cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
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
};

exports.getOrderHistory = async (req, res) => {
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
}
