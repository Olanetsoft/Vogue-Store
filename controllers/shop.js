const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
  .then(([rows]) => {
    res.render('shop/product-list', {
      prods: rows,
      pageTitle: 'All products',
      path: '/products'
    });
  })
  .catch(err => console.log(err));
};

exports.getProductById = (req, res, next) => {
  //This gets the product request query params from shop route
  const theProdId = req.params.productId;
  Product.findProductById(theProdId)
    .then(([product])=>{
      res.render('shop/product-detail', {
        product: product[0],
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) =>{
  Product.fetchAll()
  .then(([rows]) => {
    res.render('shop/index', {
    prods: rows,
    pageTitle: 'Shop', 
    path: '/'
  });
  })
  .catch(err => console.log(err));

 
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findProductById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};


exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findProductById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};


exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
}; 
