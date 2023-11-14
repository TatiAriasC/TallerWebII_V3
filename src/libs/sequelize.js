const {Sequelize} = require ('sequelize');
const setUpModels = require('../../db/models');

const sequelize = new Sequelize('carros','postgres', 'masterkey',{
host: 'localhost',
dialect: 'postgres',
logging: true
});

setUpModels (sequelize)

module.exports = sequelize;