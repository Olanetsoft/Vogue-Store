const path = require('path');

const shopController = require('../controllers/shop');

//This is imported to check if the user is authenticated else the route is blocked
const isAuth = require('../middleware/is-auth');

const express = require('express');
const router = express.Router();


router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProductById);

router.get('/cart', isAuth,shopController.getCart);

router.post('/cart',isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth,shopController.postCartDeleteProduct);

router.post('/create-order',isAuth, shopController.postOrder);

router.get('/orders', isAuth,shopController.getOrders);

module.exports = router;