'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/dig-test'
  },

  // Sequelize ORM options specific to test env
  sequelize: {
    username: 'digapp',
    password: process.env.DB_PASS || null,
    database: 'digapp_test',
    hostname: process.env.DB_HOST || null,
    options: {
      dialect: 'mysql'
    }
  },

  logfile: '/var/log/digapp.log',

  seedDB: false
};