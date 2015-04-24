'use strict';

var _ = require('lodash');
var Query = require('./query.model');

// Get list of querys based on user
exports.index = function(req, res) {
  Query.find({username: req.headers.user}, function (err, query) {
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
    if(query.username !== req.headers.user) { return res.send(401); }
    return res.json(query);
  });
};

// Creates a new query in the DB.
exports.create = function(req, res) {
  if(req.body.username !== req.headers.user) { return res.send(401); }
  Query.create(req.body, function(err, query) {
    if(err) { return handleError(res, err); }
    return res.json(201, query);
  });
};


// Overwrites an existing query in the DB.
exports.updatePut = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Query.findOneAndUpdate(req.params.id, req.body, function (err, query) {
    if (err) { return handleError(res, err); }
    if(!query) { return res.send(404); }
    if(query.username !== req.headers.user) { return res.send(401); }

    return res.json(200, query);
  });
};

// Updates an existing query in the DB.
exports.updatePatch = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Query.findById(req.params.id, function (err, query) {
    if (err) { return handleError(res, err); }
    if(!query) { return res.send(404); }
    var updated = _.merge(query, req.body);
    if(updated.username !== req.headers.user) { return res.send(401); }
    // for Mixed types, need to tell Mongoose to save over existing fields 
    if(req.body.digState) { 
      updated.markModified('digState'); 
    }
    if(req.body.elasticUIState) { 
      updated.markModified('elasticUIState'); 
    }
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
    if(query.username !== req.headers.user) { return res.send(401); }
    query.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}