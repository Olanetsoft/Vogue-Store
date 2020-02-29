const path = require('path');

const rootDir = require('../util/path');

const express = require('express');
const router = express.Router();

const products = [];

router.get('/add-product', (req, res, next)=>{
    console.log('In the second Middleware via Admin.js');
    res.render('add-product', {pageTitle: 'Add Product'})
})

router.post('/add-product', (req, res, next)=> {
    products.push({title: req.body.title})
    res.redirect('/');
});


exports.routes = router;
exports.products = products;