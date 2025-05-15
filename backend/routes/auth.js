// ...existing code...
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Otp = require('../models/Otp');
const crypto = require('crypto');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (customer or shopkeeper)
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { role, name, email, password, shopName, businessAddress } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({
      role,
      name: role === 'customer' ? name : undefined,
      email,
      password: hash,
      shopName: role === 'shopkeeper' ? shopName : undefined,
      businessAddress: role === 'shopkeeper' ? businessAddress : undefined
    });
    await user.save();
    // Generate OTP
    const otpCode = (Math.floor(100000 + Math.random() * 900000)).toString();
    const otp = new Otp({ user: user._id, otp: otpCode, expiresAt: new Date(Date.now() + 5 * 60000) });
    await otp.save();
    // TODO: Send OTP via email
    res.status(201).json({ message: 'Registered. Please verify your email.', userId: user._id });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/auth/verify
 * @desc    Verify email with OTP
 * @access  Public
 */
router.post('/verify', async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const record = await Otp.findOne({ user: userId, otp });
    if (!record || record.expiresAt < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    await User.findByIdAndUpdate(userId, { isEmailVerified: true });
    await Otp.deleteMany({ user: userId });
    res.json({ message: 'Email verified' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.isEmailVerified) return res.status(403).json({ message: 'Email not verified' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.json({ message: 'Login successful', user: { id: user._id, role: user.role, name: user.name, shopName: user.shopName } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Public
 */
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

module.exports = router;
// ...existing code...
