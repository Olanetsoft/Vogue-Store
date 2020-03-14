const Sequelize = require('sequelize');

const sequelize = new Sequelize('learn-node', 'root', 'Hayindeh2019@', 
{dialect: 'mysql', host: 'localhost'}
);

module.exports = sequelize;