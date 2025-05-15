// Order model for Customer Connect
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shopkeeper: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: String,
      name: String,
      quantity: Number,
      price: Number,
      status: { type: String, enum: ['pending', 'confirmed', 'packed', 'completed', 'cancelled'], default: 'pending' }
    }
  ],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'packed', 'completed', 'cancelled'],
    default: 'pending'
  },
  total: { type: Number, required: true },
  notifications: [
    {
      message: String,
      read: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  paymentStatus: { type: String, enum: ['pending', 'paid', 'disputed'], default: 'pending' },
  receipt: { type: String },
  locked: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
