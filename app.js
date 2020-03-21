const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session)

//Importing the error controller
const errorController = require('./controllers/error');


//Importing User
const User = require('./models/user');


const MONGODB_URI = 'mongodb+srv://idris:Hayindehdb2019@cluster0-sszay.mongodb.net/shop';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});//initialize to execute mongodb store as a constructor


//set this value globally in our application
app.set('view engine', 'ejs');
app.set('views', 'views')


//adding the route configuration
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

//use bodyParser to grab the body sent via nodejs
app.use(bodyParser.urlencoded({ extended: false }));



//This is use to statically generate files in the public folder using the path declared
app.use(express.static(path.join(__dirname, 'public')));


//configuring the session setup
app.use(session({
  secret: 'my secret', //in production this should be a long string value
  resave: false,
  saveUninitialized: false,
  store: store
}));


//Retrieving user by Id and it only runs for incoming request
app.use((req, res, next) => {
  User.findById('5e7233c063abc79acc96796d')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});


//This section below uses the declare route to navigate to the pages whenever a request is sent
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);



//This section below returns the default 404page when a path that doesn't exist is hit
app.use(errorController.get404Page);

mongoose
  .connect(
    MONGODB_URI
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Max',
          email: 'max@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
