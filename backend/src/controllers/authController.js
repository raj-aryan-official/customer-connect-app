const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register user with email verification token generation


exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate email verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');

    // Create user with verification token and isVerified false
    const user = await User.create({
      name,
      email,
      password,
      role,
      verificationToken,
      isVerified: true,
    });

    // TODO: send verification email with token (verificationToken)

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      token: generateToken(user._id),
      verificationToken, // for testing, remove in production
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Login user using MongoDB native driver with registered user check and email token verification
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Use mongoose connection to get native MongoDB client
    const client = mongoose.connection.getClient();
    const db = client.db();

    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is registered and verified with valid email token
    if (!user.isVerified || !user.verificationToken) {
      return res.status(403).json({ message: 'User is not registered or email not verified. Please verify your email before logging in.' });
    }

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Additional check: ensure user is active (optional)
    if (user.isActive === false) {
      return res.status(403).json({ message: 'User account is inactive. Please contact support.' });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Update user profile (no password change here)
exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      token: generateToken(user._id),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Change password securely
exports.changePassword = async (req, res) => {
  const { password, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'Password changed successfully' });
};


// Delete user account
exports.deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ message: 'User account deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// TODO: Implement forgotPassword, resetPassword, sendVerification, verifyEmail, firebaseReset, sendFCM
