const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf');
const flashToUser = require('connect-flash');


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

//Initialize csrf protection
const csrfProtection = csrf();


//set this value globally in our application
app.set('view engine', 'ejs');
app.set('views', 'views')


//adding the route configuration
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

//use bodyParser to grab the body sent via nodejs WITH URLENCODED MEANING TEXT BASE
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

//using csrf
app.use(csrfProtection);


//using the flash
app.use(flashToUser());



//Retrieving user by Id and it only runs for incoming request
app.use((req, res, next) => {
  if (!req.session.user) {
    return next()
  }
  User.findById(req.session.user._id)
    .then(user => {
      if(!user){
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      throw new Error(err);
    });
});



//to set local variable that are passed into views
app.use((req, res, next) => {
  
  res.locals.isAuthenticated= req.session.isLoggedIn,
  res.locals.csrfToken= req.csrfToken();
  next()
})


//This section below uses the declare route to navigate to the pages whenever a request is sent
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);



//This section below returns the default 500page when a path hit an Error
app.use('/500', errorController.get500Page);


//This section below returns the default 404page when a path that doesn't exist is hit
app.use(errorController.get404Page);

//this is a global error declaration when big error hits
app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode).render(...);
  res.redirect('/500');
});

mongoose
  .connect(
    MONGODB_URI
  )
  .then(result => {
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
