/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Query = require('./query.model');

exports.register = function(socket) {
  Query.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Query.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('query:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('query:remove', doc);
}