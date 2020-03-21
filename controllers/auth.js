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
            console.log(err);
            res.redirect('/');

        })
    })
    .catch(err => console.log(err));
    
};


exports.PostLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
};
