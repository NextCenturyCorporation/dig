'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  username: String,
  role: {
    type: String,
    default: 'user'
  },
  provider: String
});

/**
 * Validations
 */

var validatePresenceOf = function(value) {
  return value && value.length;
};

// Validate empty username
UserSchema
  .path('username')
  .validate(function(username) {
    return validatePresenceOf(username);
  }, 'Username cannot be blank');

// Validate username is not taken
UserSchema
  .path('username')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({username: value}, function(err, user) {
      if(err) throw err;
      if(user) {
        if(self.id === user.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified username is already in use.');

module.exports = mongoose.model('User', UserSchema);