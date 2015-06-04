'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../config/environment');
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');

// connect to db, just once per application
var sequelize = new Sequelize(
    config.sequelize.database, 
    config.sequelize.username, 
    config.sequelize.password, 
    config.sequelize.options);

var db = {};


// search for files like something.model.js
var re = /\w+[.]model[.]js/;
var modeldir = __dirname;

// import each model in api/user directory
fs
    .readdirSync(modeldir)
    .filter(function(file) {
        return re.exec(file);
    })
    .forEach(function(file) {
        var model = sequelize['import'](path.join(modeldir, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;