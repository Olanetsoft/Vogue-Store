const mysql = require('mysql2');

const pool =mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'learn-node',
    password: 'Hayindeh2019@'
});

module.exports = pool.promise();