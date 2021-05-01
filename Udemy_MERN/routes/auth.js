const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const isAuth = require('../middleware/isAuth');

const User = require('../models/user');

const authController = require('../controllers/auth');

// PUT /auth/signup. Route for user signup
router.put(
    '/signup',
    [
        body('email').trim().isEmail().withMessage('Please Enter a valid Email')
            .custom((value, { req }) => (
                User.findOne({ email: value }).then(userDoc => { // Checking if entered email already exists
                    if (userDoc) {
                        return Promise.reject('Email already exists. Please use another Email to Signup');
                    }
                })
            ))
            .normalizeEmail(),
        body('password').trim().isLength({ min: 5 }),
        body('name').trim().not().isEmpty()
    ],
    authController.signup);

// POST /auth/login. Route for user sign in
router.post('/login', authController.signIn);

// GET /auth/status. Route for fetching user status
router.get('/status', isAuth, authController.getUserStatus);

// PUT /auth/status. Route for changing user status
router.put('/status', isAuth, [body('status').trim().notEmpty()], authController.updateUserStatus);

module.exports = router;