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
  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description
  })
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
  Product.findAll({ where: { id: prodId } })
  .then(product => {
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product[0]
    });
  })
  .catch(err => console.log(err)) 
};


exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findAll({ where: { id: prodId } })
  .then(product => {
    product[0].title = updatedTitle;
    product[0].price = updatedPrice;
    product[0].description = updatedDesc;
    product[0].imageUrl = updatedImageUrl;
    return product[0].save();
  })
  .then(result => {
    console.log("UPDATED PRODUCT!")
  })
  .catch(err => console.log(err)) 
  res.redirect('/admin/products-list')
};


exports.getProductsList = (req, res, next) => {
  Product.findAll()
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
  Product.findAll({ where: { id: prodId } })
  .then(product => {
    return product[0].destroy();
  })
  .then(result => {
    console.log("PRODUCT DESTROYED!")
    res.redirect('/admin/products-list');
  })
  .catch(err => console.log(err)) 
  
}