//requiring bcrypt for encripting password
const bcrypt = require('bcryptjs');

//Importing User
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    //const isLoggedIn = req.get('Cookie').split(';')[1].trim().split('=')[1];
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    });
};


exports.PostLogin = (req, res, next) => {
    User.findById('5e75db0b95725d2b884cf35d')
    .then(user => {
        req.session.isLoggedIn = true
        req.session.user = user;
        req.session.save(err => {
            res.redirect('/');
        })
    })
    .catch(err => console.log(err));
    
};

exports.getSignup = (req, res, next) =>{
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
      });
};


exports.PostLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
};

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({email: email})
    .then(userDoc => {
        if(userDoc){
            return res.redirect('/signup')
        }
        return bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: {items: []}
            });
            return user.save();
        })
    })
    .then(result => {
        res.redirect('/login')
    })
    .catch(err => {
        console.log(err)
    })
};
