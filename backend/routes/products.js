// ...existing code...
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

/**
 * @route   GET /api/products
 * @desc    Get all products (public)
 */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/products
 * @desc    Add a new product (shopkeeper only)
 * @access  Private
 */
router.post('/', auth('shopkeeper'), async (req, res) => {
  try {
    const { name, category, price, stock, image } = req.body;
    const product = new Product({
      name,
      category,
      price,
      stock,
      image,
      shopkeeper: req.user.id
    });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product (shopkeeper only)
 * @access  Private
 */
router.put('/:id', auth('shopkeeper'), async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, shopkeeper: req.user.id },
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product (shopkeeper only)
 * @access  Private
 */
router.delete('/:id', auth('shopkeeper'), async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, shopkeeper: req.user.id });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
// ...existing code...
