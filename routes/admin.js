const path = require('path');

const adminController = require('../controllers/admin');

const express = require('express');
const router = express.Router();

//admin/add-product => GET
router.get('/add-product', adminController.getAddedProduct);

//admin/products-list => GET
router.get('/products-list', adminController.getProductsList);

//admin/add-product => POST
router.post('/add-product', adminController.postAddedProduct);

//admin/edit-product => GET BY QUERY PARAMS
router.get('/edit-product/:productId', adminController.getEditProduct);

//admin/edit-product => POST
router.post('/edit-product', adminController.postEditProduct);

//admin/delete-product => POST
router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;