const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Firebase Admin SDK setup
const admin = require('firebase-admin');
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH || '../config/firebaseServiceAccount.json');
if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
}

// Logging utility (simple console log, can be replaced with winston/morgan)
function logAction(action, user, details) {
  console.log(`[${new Date().toISOString()}] [${action}] User: ${user?.email || user?._id || 'unknown'} Details:`, details);
}

exports.register = async (req, res) => {
  try {
    const { email, password, role, name, phone, shopName, address, businessLicense } = req.body;
    if (!email || !password || !role) return res.status(400).json({ message: 'Missing required fields' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hash, role, name, phone, shopName, address, businessLicense });
    await user.save();
    res.status(201).json({ message: 'Registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, role: user.role, email: user.email, name: user.name, shopName: user.shopName } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    // Generate a reset token (for demo, just a random string)
    const resetToken = Math.random().toString(36).substring(2, 15);
    user.otp = resetToken;
    user.otpExpires = Date.now() + 1000 * 60 * 15; // 15 min expiry
    await user.save();
    // In production, send email here
    res.json({ message: 'Password reset token generated', resetToken });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.sendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 1000 * 60 * 10; // 10 min expiry
    await user.save();
    // In production, send email here (do not return OTP in response)
    res.json({ message: 'OTP sent. Please check your email.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.json({ message: 'Email verified' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, shopName, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, shopName, address },
      { new: true }
    );
    logAction('UPDATE_PROFILE', user, { name, phone, shopName, address });
    res.json({ message: 'Profile updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (user) {
      // Also delete from Firebase Auth if exists
      try { await admin.auth().deleteUser(user._id.toString()); } catch {}
      logAction('DELETE_ACCOUNT', user, {});
      res.json({ message: 'Account deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Send OTP/reset using Firebase Auth (email link)
exports.sendFirebaseReset = async (req, res) => {
  try {
    const { email } = req.body;
    const link = await admin.auth().generatePasswordResetLink(email);
    // In production, send this link via email (here, just return for demo)
    logAction('SEND_RESET_LINK', { email }, { link });
    res.json({ message: 'Password reset link generated', link });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.sendFirebaseOTP = async (req, res) => {
  try {
    const { email } = req.body;
    // Firebase does not support OTP by default, but you can use custom claims or 3rd party
    // For demo, just log and return
    logAction('SEND_OTP', { email }, {});
    res.json({ message: 'OTP sent (mock, use Firebase phone/email verification in production)' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
