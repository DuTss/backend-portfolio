const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth');

// Anti brute-force login
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Trop de tentatives de connexion.' }
});

// Auth PUBLIC
router.post('/login', loginLimiter, authController.login);
router.post('/register', authController.register);
router.post('/refresh', authController.refresh);

// Auth PROTEGER
router.get('/me', authMiddleware, authController.getUser);
router.put('/update', authMiddleware, authController.updateUser);
router.delete('/delete', authMiddleware, authController.deleteUser);
router.put('/password', authMiddleware, authController.updatePassword);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;