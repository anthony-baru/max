const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const rootDir = require('./util/path')
// routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found!' })
});
app.set('view engine', 'ejs');
app.set('views', 'views');
const port = process.env.port || 3000;
app.listen(port);