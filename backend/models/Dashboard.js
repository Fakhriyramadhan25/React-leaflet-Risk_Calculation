const db = require('../models/config');
const {Sequelize} = require('sequelize');

const Dashboard = db.define('DashboardMitigation',
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


module.exports = Dashboard;