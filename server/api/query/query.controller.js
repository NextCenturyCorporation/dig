'use strict';

var _ = require('lodash');
var Query = require('./query.model');

// Get list of querys based on user
exports.index = function(req, res) {
  Query.find({email: req.headers.user}, function (err, query) {
    if(err) { return handleError(res, err); }
    if(!query) { return res.send(404); }
    return res.json(query);
  });
};

// Get a single query
exports.show = function(req, res) {
  Query.findById(req.params.id, function (err, query) {
    if(err) { return handleError(res, err); }
    if(!query) { return res.send(404); }
    return res.json(query);
  });
};

// Creates a new query in the DB.
exports.create = function(req, res) {
  Query.create(req.body, function(err, query) {
    if(err) { return handleError(res, err); }
    return res.json(201, query);
  });
};

// Updates an existing query in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Query.findById(req.params.id, function (err, query) {
    if (err) { return handleError(res, err); }
    if(!query) { return res.send(404); }
    // clear out old filters if user wants to save over old query, otherwise old filters
    // will be merged with new ones. 
    if(req.body.filters) { query.filters = {}; }
    var updated = _.merge(query, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, query);
    });
  });
};

// Deletes a query from the DB.
exports.destroy = function(req, res) {
  Query.findById(req.params.id, function (err, query) {
    if(err) { return handleError(res, err); }
    if(!query) { return res.send(404); }
    query.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}