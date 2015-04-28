/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var Sequelize = require('sequelize');
var config = require('./config/environment');

// Connect to database     
mongoose.connect(config.mongo.uri, config.mongo.options);
// Connect to postgreSQL database
var sequelize = new Sequelize(
    config.sequelize.database, 
    config.sequelize.username,
    config.sequelize.password, 
    config.sequelize.options);
       
// Populate DB with sample data        
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);

require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;