const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// Helper function to delete image file
const deleteImageFile = (imagePath) => {
  if (imagePath) {
    const fullPath = path.join(__dirname, '../../', imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
};

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
      .populate('shopOwner', 'name email')
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get shop owner's products
router.get('/my-products', auth, async (req, res) => {
  try {
    const products = await Product.find({ shopOwner: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new product (Shop Owner)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'shop_owner') {
      return res.status(403).json({ message: 'Only shop owners can add products' });
    }

    const { name, price, description, category, stock } = req.body;

    const product = new Product({
      name,
      price,
      description,
      category,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      stock,
      shopOwner: req.user.id
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    // Delete uploaded file if product creation fails
    if (req.file) {
      deleteImageFile(`/uploads/${req.file.filename}`);
    }
    res.status(400).json({ message: error.message });
  }
});

// Update product (Shop Owner)
router.patch('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    if (req.user.role !== 'shop_owner') {
      return res.status(403).json({ message: 'Only shop owners can update products' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.shopOwner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this product' });
    }

    const updates = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category
    };

    if (req.file) {
      // Delete old image if exists
      deleteImageFile(product.image);
      updates.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    // Delete uploaded file if update fails
    if (req.file) {
      deleteImageFile(`/uploads/${req.file.filename}`);
    }
    res.status(400).json({ message: error.message });
  }
});

// Delete product (Shop Owner)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'shop_owner') {
      return res.status(403).json({ message: 'Only shop owners can delete products' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.shopOwner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    // Delete product image if exists
    deleteImageFile(product.image);

    await product.remove();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 