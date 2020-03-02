const ImportProduct = require('../models/product');

exports.getAddedProduct = (req, res, next)=>{
    console.log('In the products.js');
    res.render('add-product',
    {pageTitle: 'Add Product',
    path: '/admin/add-product'})
};

exports.postAddedProduct = (req, res, next)=> {
    const product = new ImportProduct(req.body.title);
    product.save();
    res.redirect('/');
}

exports.getProducts = (req, res, next)=>{
    const products = ImportProduct.fetchAll();
    res.render('shop', 
    {prods: products, 
    pageTitle: 'My shop', 
    path: '/'});
}