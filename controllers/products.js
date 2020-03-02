const products = [];

exports.getAddedProduct = (req, res, next)=>{
    console.log('In the products.js');
    res.render('add-product',
    {pageTitle: 'Add Product',
    path: '/admin/add-product'})
};

exports.postAddedProduct = (req, res, next)=> {
    products.push({title: req.body.title})
    res.redirect('/');
}

exports.getProducts = (req, res, next)=>{
    res.render('shop', 
    {prods: products, 
    pageTitle: 'My shop', 
    path: '/'});
}