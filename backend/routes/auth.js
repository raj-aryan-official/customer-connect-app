// backend/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const rateLimit = require('../middleware/rateLimit');
const router = express.Router();

// Registration
router.post('/register', rateLimit, async (req, res) => {
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
});

// Login
router.post('/login', rateLimit, async (req, res) => {
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
});

// Password reset and email verification would go here (implement as needed)

module.exports = router;
