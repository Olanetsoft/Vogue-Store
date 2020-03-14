const mysql = require('mysql2');

const pool =mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'learn-node',
    password: `${process.env.PASSWORD}`
});

module.exports = pool.promise();