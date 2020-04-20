// const mysql = require('mysql2');
// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'max',
//     password: ''
// })

// module.exports = pool.promise();
const Sequelize = require('sequelize');
const sequelize = new Sequelize('max', 'root', '', { dialect: mysql, host: 'localhost' });
module.exports = sequelize;