'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuerySchema = new Schema({
  name: String,
  digState: Schema.Types.Mixed,
  elasticUIState: Schema.Types.Mixed,
  username: { type: String, index: true },
  createDate: Date,
  lastRunDate: Date,
  frequency: String
});

module.exports = mongoose.model('Query', QuerySchema);