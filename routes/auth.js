const express = require('express');
const { check, body } = require('express-validator')
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup', [
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email!')
        .custom((value, { req }) => {
            if (value == 'anthonybaru@gmail.com') {
                throw new Error('This email is forbidden.')
            }
            return true;
        }),
    body('password')
        .isLength({ min: 5 }).withMessage('Must be min 5 characters')
        .isAlphanumeric().withMessage('Must be alphanumeric')
],
    authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);


module.exports = router;