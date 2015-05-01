'use strict';

var config = require('./config/environment');
// var fs = require('fs');
// var path = require('path');
var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';

var sequelize = new Sequelize(
    config.sequelize.database, 
    config.sequelize.username, 
    config.sequelize.password, 
    config.sequelize.options);

var db = {};

// fs
//   .readdirSync(__dirname)
//   .filter(function(file) {
//     return (file.indexOf('.') !== 0) && (file !== 'index.js');
//   })
//   .forEach(function(file) {
//     var model = sequelize['import'](path.join(__dirname, file));
//     db[model.name] = model;
//   });

// Object.keys(db).forEach(function(modelName) {
//   if ('associate' in db[modelName]) {
//     db[modelName].associate(db);
//   }
// });
var User = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING,
    field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
  },
  lastName: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

User.sync({force: true}).then(function () {
  // Table created
  return User.create({
    firstName: 'John',
    lastName: 'Hancock'
  });
});

db['user'] = User;

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;