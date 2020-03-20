exports.getLogin = (req, res, next) => {
    const isLoggedIn = req.get('Cookie').split(';')[1].trim().split('=')[1];
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: isLoggedIn
    });
};

exports.PostLogin = (req, res, next) => {
    res.setHeader('Set-Cookie', 'loggedIn=true')
    res.redirect('/');
};