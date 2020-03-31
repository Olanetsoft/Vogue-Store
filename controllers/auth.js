//requiring nodemailer
const nodemailer = require('nodemailer');

//importing express validator
const { validationResult } = require('express-validator');



//library for generating token/secure/unique
const crypto = require('crypto');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'naddad1111@gmail.com',
    pass: 'naddad1234@'
  }
});

// const mailOptions = {
//   from: 'sender@email.com', // sender address
//   to: email, // list of receivers
//   subject: 'Subject of your email', // Subject line
//   html: '<p>Your html here</p>'// plain text body
// };

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
    errorMessage: message,
    oldInput: {
      email: "",
      password: ""
    },
    validationErrors: []
  });
};


//Post login Details
exports.PostLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  //get the error express validator might have stored
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,

      //this holds the old user input
      oldInput: {
        email: email,
        password: password
      },

      //Returning all the validation errors
      validationErrors: errors.array()
    });
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          oldInput: {
            email: email,
            password: password
          },
          validationErrors: []
        });
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: 'Invalid email or password.',
            oldInput: {
              email: email,
              password: password
            },
            validationErrors: []
          });
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => {
      //console.log(err)
      //res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
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
    errorMessage: message,
    oldInput: {
      email: "",
      password: "",
      confirmPassword: ""
     
    },
    validationErrors: []
  });
};



exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  //get the error express validator might have stored
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    return res.status(422)
      .render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: errors.array()[0].msg,

        //this holds the old user input
        oldInput: {
          email: email,
          password: password,
          confirmPassword: req.body.confirmPassword
        },

        //Returning all the validation errors
        validationErrors: errors.array()
      });
  }
  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] }
      });
      return user.save();
    })
    .then(result => {
      res.redirect('/login');
      return transporter.sendMail({
        to: email,
        from: 'shop@node-complete.com',
        subject: 'Signup succeeded!',
        html: '<h1>You successfully signed up!</h1>'
      });
    })
    .catch(err => {
      //console.log(err)
      //res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};



exports.PostLogout = (req, res, next) => {
  req.session.destroy(err => {
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset-password', {
    path: '/reset-password',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

//for reset of password
exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset-password');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash('error', 'No Account with ' + req.body.email + ' Found.');
          return res.redirect('/reset-password');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();

      })
      .then(result => {
        res.redirect('/');
        transporter.sendMail({
          to: req.body.email,
          from: 'shop@node-complete.com',
          subject: 'Password reset',
          html: `
                <p>You requested a password reset</p>
                <p>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to set a new password.</p>
              `
        });
      })
      .catch(err => {
        //console.log(err)
        //res.redirect('/500');
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
  })
};

exports.getNewPassword = (req, res, next) => {
  const tokenGotten = req.params.token;
  User.findOne({ resetToken: tokenGotten, resetTokenExpiration: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash('error');
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: tokenGotten
      });
    })
    .catch(err => {
      //console.log(err)
      //res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postNewPassword = (req, res, next) => {
  const theNewPassword = req.body.password;
  const theNewUserId = req.body.userId;
  const theNewPasswordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: theNewPasswordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: theNewUserId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(theNewPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      //console.log(err)
      //res.redirect('/500');
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


