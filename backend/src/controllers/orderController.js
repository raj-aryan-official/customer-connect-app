const Order = require('../models/Order');

// Get all orders for logged-in user
exports.getOrders = async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'shopkeeper') {
      // Shopkeeper: get orders for their products
      orders = await Order.find()
        .populate('customer', 'name email')
        .populate('products.product');
    } else {
      // Customer: get their own orders
      orders = await Order.find({ customer: req.user._id })
        .populate('products.product');
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { products, totalPrice } = req.body;
    const order = new Order({
      customer: req.user._id,
      products,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (shopkeeper only)
exports.updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== 'shopkeeper') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status || order.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
