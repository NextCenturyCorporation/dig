'use strict';

var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize-hierarchy')();


var password = process.env.DB_PASS || null,
    username = process.env.DB_USER || null;

if (process.env.NODE_ENV === 'test') { 
    var database = 'digapp_test';
}
else if (process.env.NODE_ENV === 'production') {
    database = 'digapp_production';
}
else {
    database = null;
}

var options = {};
options.host = process.env.DB_HOST || null;
options.port = process.env.DB_PORT || null;
if(process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'production') {
    options.dialect = 'mysql';
}
else {
    options.dialect = 'sqlite';
    options.storage = 'db.digappdev.sqlite';
}


// connect to db, just once per application
var sequelize = new Sequelize(database, username, password, options);

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