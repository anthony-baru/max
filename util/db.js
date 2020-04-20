const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'max',
    password: ''
})

module.exports = pool.promise();