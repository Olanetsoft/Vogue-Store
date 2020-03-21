//requiring bcrypt for encripting password
const bcrypt = require('bcryptjs');

//Importing User
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    //const isLoggedIn = req.get('Cookie').split(';')[1].trim().split('=')[1];
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
    });
};


exports.PostLogin = (req, res, next) => {
    const extractedEmail = req.body.email;
    const extractedPassword = req.body.password;

    User.findOne({ email: extractedEmail })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password !')
                return res.redirect('/login')
            }
            bcrypt.compare(extractedPassword, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true
                        req.session.user = user;
                        return req.session.save(err => {
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid email or password !')
                    res.redirect('/login')
                })
                .catch(err => {
                    console.log(err)
                    res.redirect('/login')
                });
        })
        .catch(err => console.log(err));

};

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: message
    });
};



exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({ email: email })
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'Email already exist Bro!')
                return res.redirect('/signup')
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] }
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



exports.PostLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
};