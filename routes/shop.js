const path = require('path');

const rootDir = require('../util/path');

const express = require('express');
const router = express.Router();

const adminData = require('./admin')

router.get('/', (req, res, next)=>{
    res.render('shop');
});


module.exports = router;