// User model for Customer Connect
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['customer', 'shopkeeper'],
    required: true
  },
  name: { type: String, required: function() { return this.role === 'customer'; } },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  shopName: { type: String, required: function() { return this.role === 'shopkeeper'; } },
  businessAddress: { type: String },
  gstNumber: { type: String },
  logo: { type: String },
  isEmailVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
