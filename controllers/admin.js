const mongodb = require('mongodb');
const Product = require('../models/product');

//importing express validator
const { validationResult } = require('express-validator/check');

exports.getAddedProduct = (req, res, next) => {

  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};


//This create a new product item into the database
exports.postAddedProduct = (req, res, next) => {
  //this section below get the request details from the form
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const errors = validationResult(req);

  //If it has error
  if (!errors.isEmpty()) {
    //console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

//if it doesn't
  const product = new Product(
    {
      title: title,
      price: price,
      description: description,
      imageUrl: imageUrl,
      userId: req.user
    }
  );
  product
    .save()//from mongoose
    .then(result => {
      console.log('Created Product')
      res.redirect('/admin/products-list')
    })
    .catch(err => { console.log(err) });
};


//This returns product to be edited by Id
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => console.log(err))
};

//post edited product to db
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const errors = validationResult(req);


  //If it has error
  if (!errors.isEmpty()) {
    //console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/edit-product',
      editing: false,
      hasError: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  return Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString() ) {
        return res.redirect('/');
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc
      product.imageUrl = updatedImageUrl;
      return product.save()//mongoose
        .then(result => {
          console.log("UPDATED PRODUCT!");
          res.redirect('/admin/products-list');
        })
    })
    .catch(err => console.log(err))

};


exports.getProductsList = (req, res, next) => {
  Product
    .find({ userId: req.user._id })//mongoose
    .then(products => {
      res.render('admin/products-list', {
        prods: products,
        pageTitle: 'Admin Products',
        path: 'admin/products-list'
      });
    })
    .catch(err => console.log(err));
};


//This deletes product by id 
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({_id: prodId, userId: req.user._id})
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products-list');
    })
    .catch(err => console.log(err));
};