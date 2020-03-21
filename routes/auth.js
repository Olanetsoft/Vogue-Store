const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset-password', authController.getReset);

router.post('/login', authController.PostLogin);

router.post('/signup', authController.postSignup);

router.post('/logout', authController.PostLogout);

module.exports = router;
