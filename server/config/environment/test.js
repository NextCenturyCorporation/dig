'use strict';

// Test specific configuration
// ===========================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/dig-test'
  },

  // Sequelize ORM options specific to production env
  sequelize: {
    database: 'digapptest'
  },

  seedDB: false
};