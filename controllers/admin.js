const Product = require('../models/product');

exports.getAddedProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
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

  exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const updatedProduct = new Product(
      prodId,
      updatedTitle,
      updatedImageUrl,
      updatedDesc,
      updatedPrice
    );
    updatedProduct.save();
    res.redirect('/admin/products');
  };
    

  exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
      return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findProductById(prodId, product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    });
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
  