'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/dig-dev'
  },

  // Sequelize ORM options specific to production env
  sequelize: {
    database: 'digappdev',
    options: {
        host: 'localhost'
    }
  },

  seedDB: true
};
