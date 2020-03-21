const path = require('path');

const adminController = require('../controllers/admin');

//This is imported to check if the user is authenticated else the route is blocked
const isAuth = require('../middleware/is-auth');

const express = require('express');
const router = express.Router();

// //admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddedProduct);

// //admin/products-list => GET
router.get('/products-list',isAuth, adminController.getProductsList);

// //admin/add-product => POST
router.post('/add-product',isAuth, adminController.postAddedProduct);

// //admin/edit-product => GET BY QUERY PARAMS
router.get('/edit-product/:productId', isAuth,adminController.getEditProduct);

// //admin/edit-product => POST
router.post('/edit-product', isAuth,adminController.postEditProduct);

// //admin/delete-product => POST
router.post('/delete-product', isAuth,adminController.postDeleteProduct);

module.exports = router;