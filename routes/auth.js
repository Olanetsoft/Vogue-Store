const express = require('express');

//importing express validator
const { check } = require('express-validator/check');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset-password', authController.getReset);

router.post('/reset-password', authController.postReset);

router.post('/login', authController.PostLogin);

router.post('/signup',
    check('email')
        .isEmail()
        .withMessage('Please Enter a valid Email'),
    authController.postSignup);

router.post('/logout', authController.PostLogout);

router.get('/reset-password/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;
