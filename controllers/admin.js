const mongodb = require('mongodb');
const Product = require('../models/product');


exports.getAddedProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

//This create a new product item into the database
exports.postAddedProduct = (req, res, next) => {
  //this section below get the request details from the form
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, price, description, imageUrl);
  product
    .save()
    .then(result => {
      res.redirect('/admin/products-list')
    })
    .catch(err => console.log(err));
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
        product: product
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

  const product = new Product(
    updatedTitle,
    updatedPrice,
    updatedDesc,
    updatedImageUrl,
    prodId
    );
  product
    .save()
    .then(result => {
      console.log("UPDATED PRODUCT!");
      res.redirect('/admin/products-list');
    })
    .catch(err => console.log(err))
  
};


exports.getProductsList = (req, res, next) => {
  Product
    .fetchAll()
    .then(products => {
      res.render('admin/products-list', {
        prods: products,
        pageTitle: 'Admin Products',
        path: 'admin/products-list'
      });
    })
    .catch(err => console.log(err));
};

// //This deletes product by id 
// exports.postDeleteProduct = (req, res, next) => {
//   const prodId = req.body.productId;
//   Product.findById(prodId)
//     .then(product => {
//       return product.destroy();
//     })
//     .then(result => {
//       console.log('DESTROYED PRODUCT');
//       res.redirect('/admin/products-list');
//     })
//     .catch(err => console.log(err));

// };