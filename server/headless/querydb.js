/**
 * TODO:
 * - use environment or file configuration instead of hardcoded 
 *   values for url, log file name, collection name
 * - handle errors
 */
'use strict'


// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../config/environment');
var models = require('../models');
var assert = require('assert');

var findSSQ = function(period) {
    return models.Query.findAll({
        where: {
            notificationHasRun: false,
            frequency: period
        }
    })
}

var hourlySSQ = function () { return findSSQ('hourly'); }
var dailySSQ = function() { return findSSQ('daily'); }
var weeklySSQ = function() { return findSSQ('weekly'); }

models.Query.sync()
.then(dailySSQ)
.then (function (queries) {
    queries.forEach(function(query) {
        console.log(query.elasticUIState);
    });   
})
.catch(function (err) {
    console.log (err);
});