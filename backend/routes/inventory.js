// ...existing code...
const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

/**
 * @route   GET /api/inventory
 * @desc    Get inventory for shopkeeper
 * @access  Private (shopkeeper)
 */
router.get('/', auth('shopkeeper'), async (req, res) => {
  try {
    const inventory = await Inventory.findOne({ shopkeeper: req.user.id }).populate('products.product');
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/inventory
 * @desc    Add/update inventory for shopkeeper
 * @access  Private (shopkeeper)
 */
router.post('/', auth('shopkeeper'), async (req, res) => {
  try {
    const { products } = req.body;
    let inventory = await Inventory.findOne({ shopkeeper: req.user.id });
    if (!inventory) {
      inventory = new Inventory({ shopkeeper: req.user.id, products });
    } else {
      inventory.products = products;
    }
    await inventory.save();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
// ...existing code...
