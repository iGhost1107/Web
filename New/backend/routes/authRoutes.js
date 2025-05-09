const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware'); // ✅ đúng với exports.verifyToken

// Route đăng ký
router.post('/register', authController.register);

// Route đăng nhập
router.post('/login', authController.login);

// Route lấy thông tin người dùng
router.get('/me', verifyToken, authController.getMe);

// authRoutes.js
router.post('/change-password', authController.changePassword);

router.put('/update', verifyToken, authController.updateUserInfo);

router.get('/verify-email', authController.verifyEmail);

const rateLimit = require("express-rate-limit");

const resendLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 3,
    message: { message: "Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau." }
,});
  
router.post('/resend-verification', resendLimiter, authController.resendVerification);

module.exports = router;
