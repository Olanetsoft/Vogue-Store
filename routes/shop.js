const path = require('path');

const productController = require('../controllers/products');

const express = require('express');
const router = express.Router();



router.get('/', productController.getProducts);


module.exports = router;