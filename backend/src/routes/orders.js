const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Create new order (Customer)
router.post('/', auth, async (req, res) => {
  try {
    const { items, shopOwnerId, totalAmount, notes } = req.body;
    
    const order = new Order({
      customer: req.user.userId,
      shopOwner: shopOwnerId,
      items,
      totalAmount,
      notes,
    });

    await order.save();

    // Notify shop owner
    const io = req.app.get('io');
    io.to(shopOwnerId).emit('newOrder', {
      message: 'New order received',
      order: order
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get customer's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.userId })
      .populate('shopOwner', 'name email')
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get shop owner's orders
router.get('/shop-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ shopOwner: req.user.userId })
      .populate('customer', 'name email phone')
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status (Shop Owner)
router.patch('/:orderId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.orderId)
      .populate('customer', '_id')
      .populate('shopOwner', '_id');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.shopOwner._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = status;
    await order.save();

    // Notify customer
    const io = req.app.get('io');
    io.to(order.customer._id.toString()).emit('orderStatusUpdate', {
      message: `Order status updated to ${status}`,
      order: order
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update payment status (Shop Owner)
router.patch('/:orderId/payment', auth, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = await Order.findById(req.params.orderId)
      .populate('customer', '_id')
      .populate('shopOwner', '_id');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.shopOwner._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    // Notify customer
    const io = req.app.get('io');
    io.to(order.customer._id.toString()).emit('paymentStatusUpdate', {
      message: `Payment status updated to ${paymentStatus}`,
      order: order
    });

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 