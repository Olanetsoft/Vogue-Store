exports.getLogin = (req, res, next) => {
    const isLoggedIn = req.get('Cookie').split(';')[1].trim().split('=')[1];
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: isLoggedIn
    });
};

exports.PostLogin = (req, res, next) => {
    req.session.isLoggedIn = true
    res.redirect('/');
};