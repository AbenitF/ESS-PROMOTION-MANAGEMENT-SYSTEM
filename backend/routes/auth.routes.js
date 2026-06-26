/**
 * Auth Routes
 * POST /api/auth/login
 * POST /api/auth/logout         (protected)
 * GET  /api/auth/profile        (protected)
 * PUT  /api/auth/profile        (protected)
 * PUT  /api/auth/change-password (protected)
 */

const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

// Login validation rules
const loginValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required.')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be 3–50 characters.'),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
];

// Profile update validation
const profileValidation = [
  body('full_name')
    .trim()
    .notEmpty().withMessage('Full name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Full name must be 2–100 characters.'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('A valid email is required.')
    .normalizeEmail(),
];

// Change password validation
const changePasswordValidation = [
  body('current_password')
    .notEmpty().withMessage('Current password is required.'),
  body('new_password')
    .notEmpty().withMessage('New password is required.')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and a number.'),
];

router.post('/login', loginValidation, validate, authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, profileValidation, validate, authController.updateProfile);
router.put('/change-password', authenticate, changePasswordValidation, validate, authController.changePassword);

module.exports = router;
