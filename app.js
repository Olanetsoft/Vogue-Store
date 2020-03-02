const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

//Importing the error controller
const errorController = require('./controllers/error');

const app = express();

//set this value globally in our application
app.set('view engine', 'ejs');
app.set('views', 'views')


//adding the route configuration
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

//use bodyParser to grab the body sent via nodejs
app.use(bodyParser.urlencoded({ extended: true }));

//This is use to statically generate files in the public folder using the path declared
app.use(express.static(path.join(__dirname, 'public')));


//This section below uses the declare route to navigate to the pages whenever a request is sent
app.use('/admin', adminRoutes);
app.use(shopRoutes);


//This section below returns the default 404page when a path that doesn't exist is hit
app.use(errorController.get404Page);

app.listen(3000);
