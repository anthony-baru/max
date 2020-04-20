const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/db');
const errorController = require('./controllers/error');

//models
const Product = require('./models/product');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

sequelize
    .sync({ force: true })
    .then(result => {
        app.listen(port);
    }).catch(err => {
        console.log(err);
    })
let port = process.env.port || 3000;

