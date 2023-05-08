const { Sequelize } = require('sequelize');

const db = new Sequelize('myapp2', 'root', 'ketan@5801', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = db;







