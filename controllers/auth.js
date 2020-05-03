const User = require('../models/user');
const bcrypt = require('bcryptjs');
const sendMail = require('../util/mail.config');

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
        errorMessage: message
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
        isAuthenticated: false,
        csrfToken: req.csrfToken(),
        errorMessage: message

    });
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password!');
                return res.redirect('/login');
            }
            bcrypt.compare(password, user.password)
                .then(result => {
                    if (result) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    req.flash('error', 'Invalid email or password!');
                    res.redirect('/login')
                })
                .catch(err => console.log(err))

        })
        .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                req.flash('error', 'Email already exists. Please enter a different one.');

                return res.redirect('/signup');
            }
            return bcrypt
                .hash(password, 12)
                .then(hashedP => {
                    const user = new User({
                        name: name,
                        email: email,
                        password: hashedP,
                        cart: { items: [] }
                    });
                    return user.save();
                })
                .then(result => {
                    sendMail(email, 'sign up succeeded', '<h1>Sign up successful mate!</h1>', (err, data) => {
                        if (err) {
                            return res.status(500).json({ message: "Internal Error!", data: data });
                        }
                    });
                    res.redirect('/login');
                })
        }).catch(err => { console.log(err) })

};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/', {
            csrfToken: req.csrf()
        });
    });
};