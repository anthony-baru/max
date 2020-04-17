const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const errorController = require('./controllers/error')
// routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/admin', adminRoutes);
app.use(shopRoutes);
//redering errors like 404
app.use(errorController.get404);
app.set('view engine', 'ejs');
app.set('views', 'views');
const port = process.env.port || 3000;
app.listen(port);