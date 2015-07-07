'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/dig-dev'
  },

  // Sequelize ORM options specific to development env
  sequelize: {
    username: null,
    password: process.env.DB_PASS || null,
    database: null,
    hostname: null,
    options: {
      dialect: 'sqlite',
      storage: './db.digappdev.sqlite'
    }
  },

  logfile: 'digapp.log',

  seedDB: true
};
