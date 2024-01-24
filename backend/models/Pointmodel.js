const db = require('./config');
const {Sequelize} = require('sequelize');

const Pointmodel = db.define('PointData',
{
    type: {
        type: Sequelize.STRING
    },
    tags: {
        type: Sequelize.STRING
    },
    latitude: {
        type: Sequelize.FLOAT
    },
    longitude: {
        type: Sequelize.FLOAT
    },
})


module.exports = Pointmodel;