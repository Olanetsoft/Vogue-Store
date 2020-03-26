const mongodb = require('mongodb');
const Product = require('../models/product');


const fileHelper = require('../util/file');


//importing express validator
const { validationResult } = require('express-validator');

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
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  //console.log(imageUrl)
  const errors = validationResult(req);

  if(!image){
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: true,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description
      },
      errorMessage: 'Attached file is not an image !',
      validationErrors: []
    });
  }

  //If it has error
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: true,
      hasError: true,
      product: {
        title: title,
        price: price,
        description: description
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const imageUrl = image.path;
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
    .catch(err => {
      //console.log(err)
      //res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    .catch(err => {
      //console.log(err)
      //res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);}
      )
};
 
//post edited product to db
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImage = req.file;
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
        price: updatedPrice,
        description: updatedDesc
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  return Product.findById(prodId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;

      if(updatedImage) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = updatedImage.path;
      }

      
      return product.save()//mongoose
        .then(result => {
          console.log("UPDATED PRODUCT!");
          res.redirect('/admin/products-list');
        })
    })
    .catch(err => {
      //console.log(err)
      //res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);}
      )

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
    .catch(err => {
      //console.log(err)
      //res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);}
      );

};


//This deletes product by id 
exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return next(new Error('Product not found.'));
      }
      fileHelper.deleteFile(product.imageUrl);
      return Product.deleteOne({ _id: prodId, userId: req.user._id });
    })
    .then(() => {
      console.log('DESTROYED PRODUCT');
      //res.redirect('/admin/products-list');
      res.status(200)
      .json({message: 'Success !'});
    })
    .catch(err => {
     res.status(500).json({message: 'Product delete Failed...'});
    });
};