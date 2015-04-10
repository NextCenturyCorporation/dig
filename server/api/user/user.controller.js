'use strict';

var User = require('./user.model');
var config = require('../../config/environment');

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
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};