/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
var models = require('./models');
       
// Populate DB with sample data        
if(config.seedDB) {require('./config/seedsql');}

// Setup server
var app = express();
var server = require('http').createServer(app);

require('./config/express')(app);
require('./routes')(app);

// Start server
models.sequelize.sync().then(function () {
    server.listen(config.port, config.ip, function () {
        console.log('Express server listening on %d, in %s mode', 
            config.port, app.get('env'));
    });
});

app.models = models;

// Expose app
exports = module.exports = app;