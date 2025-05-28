const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/change-password', protect, changePassword);
router.delete('/account', protect, deleteAccount);

// TODO: Add routes for forgot-password, reset-password, send-verification, verify-email, firebase-reset, fcm

module.exports = router;
