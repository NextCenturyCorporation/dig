'use strict';

var User = require('./user.model');
var config = require('../../config/environment');
var _ = require('lodash');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.headers.user;
  User.findOne({
    username: userId
  }, function(err, user) {
    if (err) return next(err);
    if (!user) {
      user = new User({username: req.headers.user});
      user.save(function(createErr) {
        if(createErr) return next(createErr);
      });
    }
    res.json(user);
  });
};

/**
 * Update my info
 */
exports.updateMe = function(req, res, next) {
  var userId = req.headers.user;
  User.findOne({
    username: userId
  }, function(err, user) {
    if (err) return next(err);
    if (!user) { return res.send(404); }
    var updated = _.merge(user, req.body);
    // for Mixed types, need to tell Mongoose to save over existing fields 
    if(req.body.blurConfig) { 
      updated.markModified('blurConfig'); 
    }
    updated.save(function (saveErr) {
      if (saveErr) { return next(saveErr); }
      return res.json(200, updated);
    });
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};