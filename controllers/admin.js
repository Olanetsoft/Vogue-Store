const Product = require('../models/product');

exports.getAddedProduct = (req, res, next) => {
    res.render('admin/add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product'
    });
  };
  
  exports.postAddedProduct = (req, res, next) => {
    //this section below get the request details from the form
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    const product = new Product(title, imageUrl, description, price);
    product.save();
    res.redirect('/');
  };

  exports.getProductsList = (req, res, next) =>{
    Product.fetchAll(products => {
      res.render('admin/products-list', {
        prods: products,
        pageTitle: 'Admin Products', 
        path: 'admin/products-list'
      });
    });
  };
  