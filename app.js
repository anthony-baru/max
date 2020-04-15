const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(adminRoutes);
app.use(shopRoutes);

const port = process.env.port || 3000;
app.listen(port);