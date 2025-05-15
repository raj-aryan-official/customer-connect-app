// Product model for Customer Connect
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String },
  shopkeeper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  lowStockThreshold: { type: Number, default: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
