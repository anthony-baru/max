const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./util/db');
const errorController = require('./controllers/error');

//models
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findOne({ where: { id: 1 } })
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// associations
//product and user => one to many
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

// user and cart => one to one
User.hasOne(Cart);
Cart.belongsTo(User);

//cart and product => many to many
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

// order and user
Order.belongsTo(User);
User.hasMany(Order);

//order and user
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });//optional

sequelize
    .sync()
    // .sync({ force: true })
    .then(result => {
        return User.findOne({
            where: {
                id: 1
            }
        })
    })
    .then(user => {
        if (!user) {
            return User.create({ name: 'anthony baru', email: 'anthonybaru@gmail.com' });
        }
        return user;
    })
    .then(user => {
        // console.log(user);
        return user.createCart();
    })
    .then(cart => {
        app.listen(port);
    })
    .catch(err => {
        console.log(err);
    })
let port = process.env.port || 3000;

