const db = require('./config');
const {Sequelize} = require('sequelize');

const Usermodel = db.define('userdata',
{
    username: {
        type: Sequelize.STRING
    },
    firstname: {
        type: Sequelize.STRING
    },
    lastname: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
})


module.exports = Usermodel;