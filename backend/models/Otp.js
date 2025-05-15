// OTP model for Customer Connect (for email verification)
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model('Otp', otpSchema);
