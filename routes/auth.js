const express = require('express');

//importing express validator
const { check, body } = require('express-validator/check');


//Importing User
const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset-password', authController.getReset);

router.post('/reset-password', authController.postReset);

router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.'),
    body('password', 'Password has to be valid.')
        .isLength({ min: 5 })
        .isAlphanumeric()
], authController.PostLogin);

router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Please enter a valid email.')
            .custom((value, { req }) => {
                // if (value === 'test@test.com') {
                //   throw new Error('This email address if forbidden.');
                // }
                // return true;
                return User.findOne({ email: value })
                    .then(userDoc => {
                        if (userDoc) {
                            return Promise.reject(
                                'E-Mail exists already, please pick a different one.'
                            );
                        }
                    });
            }),

        body('password',
            'Valid password Required with at least 5 characters')
            .isLength({ min: 5 })
            .isAlphanumeric(),
        body('confirmPassword').custom(({ value }, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password have to match!');
            }
            return true;
        })
    ],
    authController.postSignup);

router.post('/logout', authController.PostLogout);

router.get('/reset-password/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
