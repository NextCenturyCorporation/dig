'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var QuerySchema = new Schema({
  name: String,
  searchTerms: String,
  filters: Object,
  email: { type: String, lowercase: true, index: true },
  createDate: Date,
  lastRunDate: Date,
  frequency: String
});

module.exports = mongoose.model('Query', QuerySchema);