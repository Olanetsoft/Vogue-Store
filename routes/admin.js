const path = require('path');

//importing express validator
const { body } = require('express-validator');

const adminController = require('../controllers/admin');

//This is imported to check if the user is authenticated else the route is blocked
const isAuth = require('../middleware/is-auth');

const express = require('express');
const router = express.Router();

// //admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddedProduct);

// //admin/products-list => GET
router.get('/products-list' ,isAuth , adminController.getProductsList);

// //admin/add-product => POST
router.post('/add-product',
[
    body('title', 'Oops! Not valid for a Title')
    .isString()
    .isLength({min: 3})
    .trim(),
    body('price', 'Oops! Not a valid price')
    .isFloat(),
    body('description', 'Oops! Not valid for a description')
    .isLength({min: 5, max: 400})
    .trim()
],
 isAuth, adminController.postAddedProduct);

// //admin/edit-product => GET BY QUERY PARAMS
router.get('/edit-product/:productId', isAuth,adminController.getEditProduct);

// //admin/edit-product => POST
router.post('/edit-product',[
    body('title', 'Oops! Not valid for a Title')
    .isAlphanumeric()
    .isLength({min: 3})
    .trim(),
    body('price', 'Oops! Not a valid price')
    .isFloat(),
    body('description', 'Oops! Not valid for a description')
    .isLength({min: 5, max: 400})
    .trim()

]
, isAuth,adminController.postEditProduct);

// //admin/delete-product => POST
router.post('/delete-product', isAuth,adminController.postDeleteProduct);

module.exports = router;