const Product = require('../models/product');
const Order = require('../models/order');


exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All products',
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getProductById = (req, res, next) => {
  //This gets the product request query params from shop route
  const theProdId = req.params.productId;
  // Product.findAll({ where: { id: theProdId } })
  //     .then(products => {
  //       res.render('shop/product-detail', {
  //         product: products[0],
  //         pageTitle: products[0].title,
  //         path: '/products'
  //       });
  //     })
  //     .catch(err => console.log(err));

  Product.findById(theProdId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => console.log(err));
};



exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(products => {

      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => console.log(err))

};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
};


//This deletes CART by id 
exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};


// exports.postOrder = (req, res, next) => {
//   let fetchedCart;
//   req.user
//   .getCart()
//   .then(cart => {
//     fetchedCart = cart;
//     return cart.getProducts();
//   })
//   .then(products =>{
//     return req.user.createOrder()
//     .then( order => {
//       order.addProducts(products.map(product =>{
//         product.orderItem = {quantity: product.cartItem.quantity}

//         return product;
//       }));
//     })
//     .then(result =>{
//       return fetchedCart.setProducts(null)
//     })
//     .then(result => {
//       res.redirect('/orders');
//     })
//     .catch(err => console.log(err));
//   })
//   .catch(err => console.log(err))
// };

// exports.getOrders = (req, res, next) => {
//   req.user
//   .getOrders({include: ['products']})
//   .then(orders => {
//     res.render('shop/orders', {
//       path: '/orders',
//       pageTitle: 'Your Orders',
//       orders: orders
//     });
//   })
//   .catch(err => console.log(err));

// };

