const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

//Importing the error controller
const errorController = require('./controllers/error');

//Import mongo connection
const mongoConnect = require('./util/database').mongoConnect;

//Importing User
const User = require('./models/user');


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
    User.findById('5e70d0c8e48f57485c1152a7')
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err))
    next();
});


//This section below uses the declare route to navigate to the pages whenever a request is sent
app.use('/admin', adminRoutes);
app.use(shopRoutes);


//This section below returns the default 404page when a path that doesn't exist is hit
app.use(errorController.get404Page);

mongoConnect(() => {
  app.listen(3000);
});