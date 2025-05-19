// backend/routes/auth.js
const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const rateLimit = require('../middleware/rateLimit');
const router = express.Router();

// Registration & Login
router.post('/register', rateLimit, authController.register);
router.post('/login', rateLimit, authController.login);

// Password reset & email verification
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/send-verification', authController.sendVerification);
router.post('/verify-email', authController.verifyEmail);

// Firebase password reset and FCM notification
router.post('/firebase-reset', authController.sendFirebaseReset);
router.post('/fcm', authController.sendFCM);

// User profile management
router.get('/profile', auth(), authController.getProfile);
router.put('/profile', auth(), authController.updateProfile);
router.delete('/account', auth(), authController.deleteAccount);

// List all users (admin only - add admin check as needed)
router.get('/users', auth(), authController.listUsers);

module.exports = router;
