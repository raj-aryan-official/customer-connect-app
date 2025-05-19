const Inventory = require('../models/Inventory');

exports.getInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findOne({ shopkeeper: req.user.id }).populate('products.product');
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateInventory = async (req, res) => {
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
};
