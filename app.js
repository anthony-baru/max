const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
require('dotenv').config();
const multer = require('multer');

const User = require('./models/user');
//mongo db
const MongoDBStore = require('connect-mongodb-session')(session);
const MONGODB_URI = 'mongodb://localhost:27017/shop?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',

})
const csrfProtection = csrf();
// views
app.set('view engine', 'ejs');
app.set('views', 'views');
//routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'mysecret', resave: false, saveUninitialized: false, store: store }))
app.use(csrfProtection);
app.use(flash());
//file handling middleware
// app.use(multer({ dest: 'images' }).single('image'));
//csrf and logged in
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User
        .findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => {
            res
                .status(500)
                .render('500', {
                    pageTitle: 'Error',
                    path: '/500',
                    isAuthenticated: req.session.isLoggedIn
                });
        })
});

// routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

//error routes
app.get('/500', errorController.get500);
app.use(errorController.get404);

//error handling middleware
app.use((error, req, res, next) => {
    res.redirect('/500');
})

let port = process.env.port || 3000;
mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then((result) => {
        app.listen(port);
    })
    .catch(err => {
        console.log(err)
    })