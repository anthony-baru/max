const express = require('express');
const { check, body } = require('express-validator')
const authController = require('../controllers/auth');
const User = require('../models/user');
const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', [
    body('email')
        .isEmail().withMessage('Please enter valid email').normalizeEmail(),
    body('password', 'Password has to be valid.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
], authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup', [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email!')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(user => {
                    if (user) {
                        return Promise.reject('Email exist. Please enter a different one.');
                    }
                })
        })
        .normalizeEmail(),
    check('password')
        .isLength({ min: 5 }).withMessage('Must be min 5 characters')
        .isAlphanumeric().withMessage('Password must be alphanumeric')
        .trim(),
    body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error(`Passwords don't match`)
            }
            return true;
        })
],
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);


module.exports = router;