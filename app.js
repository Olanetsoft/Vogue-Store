const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

//Importing the error controller
const errorController = require('./controllers/error');

const sequelize = require('./util/database');

//Importing models of product,user,cart and cart Item
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const app = express();

//set this value globally in our application
app.set('view engine', 'ejs');
app.set('views', 'views')


//adding the route configuration
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//use bodyParser to grab the body sent via nodejs
app.use(bodyParser.urlencoded({ extended: false }));

//This is use to statically generate files in the public folder using the path declared
app.use(express.static(path.join(__dirname, 'public')));

//Retrieving user by Id and it only runs for incoming request
app.use((req, res, next) =>{
    User.findById(1)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err))
});


//This section below uses the declare route to navigate to the pages whenever a request is sent
app.use('/admin', adminRoutes);
app.use(shopRoutes);


//This section below returns the default 404page when a path that doesn't exist is hit
app.use(errorController.get404Page);

//This add relations between users and product
Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
//This is optional but can also be stated because a user can have many product
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart,  {through: CartItem});



//this sync model to database by creating a table if it does not exist
sequelize
  //.sync({ force: true })
  .sync()
  .then(result => {
    return User.findById(1);
    // console.log(result);
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Idris', email: 'test@test.com' });
    }
    return user;
  })
  .then(user => {
    //console.log(user);
    return user.createCart();
  })
  .then(cart => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });


