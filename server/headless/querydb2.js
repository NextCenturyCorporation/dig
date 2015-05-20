'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var config = require('../config/environment');
var models = require('../models');
var assert = require('assert');
var elasticsearch = require('elasticsearch');
var ejs = require('elastic.js');
var _ = require('lodash');

var client = new elasticsearch.Client({
    host:'localhost:9200', log:'trace'});


// get a collection of all SSQs given the frequency
// Only SSQs that do not already have a notification are returned
var findSSQ = function(period) {
    return models.Query.findAll({
        where: {
            notificationHasRun: true,
            frequency: period
        }
    })
}

var getEsQuery = function(ssq) {
    var esQuery = {};

    var elasticUIState = JSON.parse(ssq.elasticUIState);
    console.log(elasticUIState);

    if (Object.keys(elasticUIState.queryState).length > 0) {
        esQuery.query = {};
        esQuery.query.query_string = elasticUIState.queryState.query_string;        
    }

    esQuery.fields = ["_timestamp"];
    esQuery.sort = {'_timestamp': {'order': 'desc'}};
    esQuery.size = 1;

    if (Object.keys(elasticUIState.filterState).length > 0) {
        esQuery.filter = ssq.filterState;
    }

    console.log(esQuery);
    return esQuery;
}


// given a SSQ: 
// 1. run the ES query on the elasticsearch index sorted newest first
// 3. compare most recent result with last run date
// 4. if new results are available, add a notification
var runSSQ = function(findSSQ) {
    return function() {
        models.Query.sync()
        .then (findSSQ)
        .then (function (queries) {
            queries.forEach(function(query) {
                var results = {};

                // query elasticsearch for new records since the last run date
                client.search({
                    index: 'mockads',
                    type: 'ad',
                    body: getEsQuery(query)
                })
                .then(function (resp) {
                    console.log(resp);
                    results = resp;
                    var latestResultDate = new Date(results.hits.hits[0].fields._timestamp);
                    var diff = latestResultDate - query.lastRunDate;
                    console.log('lastRunDate: %s', query.lastRunDate);
                    if (diff > 0) {
                        query.notificationDateTime = new Date();
                        query.notificationHasRun = false;
                        query.save({fields: ['notificationDateTime', 'notificationHasRun']})
                        .then(function() {
                            console.log('updated %s', query.name);
                        })
                    }
                }, function (err) {
                    console.trace(err.message);
                });
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
