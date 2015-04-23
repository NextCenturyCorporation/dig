'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NotificationSchema = new Schema({
  queryId: { type: Schema.ObjectId, index: true, required: true },
  username: { type: String, index: true, required: true },
  hasRun: Boolean,
  dateCreated: Date
});


/**
 * Validations
 */

var validatePresenceOf = function(value) {
  return value && value.length;
};

// Validate empty username
NotificationSchema
  .path('username')
  .validate(function(username) {
    return validatePresenceOf(username);
  }, 'Username cannot be blank');

// Validate empty queryId
NotificationSchema
  .path('queryId')
  .validate(function(queryId) {
    return validatePresenceOf(queryId);
  }, 'QueryId cannot be blank');

module.exports = mongoose.model('Notification', NotificationSchema);