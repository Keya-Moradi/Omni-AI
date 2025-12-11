const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

const signupValidation = [
    body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
    body('email').isEmail().withMessage('A valid email is required.'),
    body('profile_info').optional().isString().isLength({ max: 500 }).withMessage('Profile info too long.'),
    body('preferences').optional().isString()
];

const loginValidation = [
    body('username').trim().notEmpty().withMessage('Username is required.'),
    body('password').notEmpty().withMessage('Password is required.')
];

// Authentication routes
router.get('/signup', authController.signupPage);
router.post('/signup', signupValidation, authController.signup);
router.get('/login', authController.loginPage);
router.post('/login', loginValidation, authController.login);
router.get('/logout', authController.logout);

module.exports = router;
