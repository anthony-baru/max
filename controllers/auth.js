const User = require('../models/user');
const bcrypt = require('bcryptjs');
const sendMail = require('../util/mail.config');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            isAuthenticated: false,
            csrfToken: req.csrfToken(),
            errorMessage: errors.array()[0].msg
        });
    }
    bcrypt
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
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/', {
            csrfToken: req.csrf()
        });
    });
};

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        isAuthenticated: false,
        csrfToken: req.csrfToken(),
        errorMessage: message
    });
};

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User
            .findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'Invalid email');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                res.redirect('/');
                sendMail(
                    req.body.email,
                    'PASSWORD RESET LINK',
                    `<p>Here is your password reset link valid for one hour:</p>
                <p>Click this <a href='http://localhost:3000/reset/${token}'>link</a> to set new password.</p>`,
                    (err, info) => {
                        if (err) {
                            console.log(err)
                        }
                    }
                )
            })
            .catch(err => console.log(err))
    })
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User
        .findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
        .then(user => {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/new-password', {
                path: '/new-passowrd',
                pageTitle: 'New Password',
                isAuthenticated: false,
                csrfToken: req.csrfToken(),
                errorMessage: message,
                userId: user._id.toString(),
                passwordToken: token
            });
        })
        .catch(err => { console.log(err) })
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({ resetToken: passwordToken, resetTokenExpiration: { $gt: Date.now() }, _id: userId })
        .then(user => {
            resetUser = user;
            return bcrypt
                .hash(newPassword, 12)
        })
        .then(hash => {
            resetUser.password = hash;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpiration = undefined;
            return resetUser.save();
        })
        .then(result => {
            res.redirect('/login');
        })
        .catch(err => console.log(err))
}

