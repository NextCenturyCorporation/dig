'use strict';

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

var runSSQ = function(whichFindSSQ) {
    return function() {
        models.Query.sync()
        .then (whichFindSSQ)
        .then (function (queries) {
            queries.forEach(function(query) {

                //TODO: run the elasticsearch query right here
                console.log(query.elasticUIState);
            });   
        })
        .catch(function (err) {
            console.log (err);
        });         
    }
}

var hourlySSQ = function () { return findSSQ('hourly'); }
var dailySSQ = function() { return findSSQ('daily'); }
var weeklySSQ = function() { return findSSQ('weekly'); }

exports.runHourlySSQ = runSSQ (hourlySSQ);
exports.runDailySSQ = runSSQ (dailySSQ);
exports.runWeeklySSQ = runSSQ (weeklySSQ);
