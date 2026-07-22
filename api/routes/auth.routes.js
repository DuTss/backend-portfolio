const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../auth/middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getUser);
router.put('/update', authMiddleware, authController.updateUser);
router.delete('/delete', authMiddleware, authController.deleteUser);
router.put('/password', authMiddleware, authController.updatePassword);
router.post('/logout', authMiddleware, authController.logout);
router.post('/refresh', authController.refresh);

module.exports = router;