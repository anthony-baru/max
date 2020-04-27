const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorController = require('./controllers/error');
// const User = require('./models/user');
//mongo db
const mongoose = require('mongoose');



const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//     User
//         .findById('5ea571bcc71a2b2b10c9341a')
//         .then(user => {
//             req.user = new User(user.name, user.email, user.cart, user._id);
//             next();
//         })
//         .catch(err => console.log(err))
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
let port = process.env.port || 3000;

mongoose.connect('mongodb://localhost:27017/shop?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(() => {
        app.listen(port)
    })
    .catch(err => {
        console.log(err)
    })