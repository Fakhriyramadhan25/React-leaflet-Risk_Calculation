const { Sequelize } = require('sequelize');

const dotenv = require('dotenv');
dotenv.config()

process.env.PORT

const sequelize = new Sequelize('RiskCalculation','postgres','12345',{
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false,
    port: '5436',
    pool:{
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

module.exports = sequelize;