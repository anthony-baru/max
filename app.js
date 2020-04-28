const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
const User = require('./models/user');
//mongo db
const mongoose = require('mongoose');



const app = express();
// views
app.set('view engine', 'ejs');
app.set('views', 'views');
//routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User
        .findById('5ea69fddff66814ef44e762d')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);
let port = process.env.port || 3000;

mongoose.connect('mongodb://localhost:27017/shop?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then((result) => {
        User
            .findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: 'tony',
                        email: 'anthonybaru@gmail.com',
                        cart: {
                            items: []
                        }
                    })
                    user.save()
                        .catch(err => console.log(err));
                }
            })
        app.listen(port);
    })
    .catch(err => {
        console.log(err)
    })