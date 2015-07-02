'use strict';

/*
 * The purpose of this module for executing Saved Scheduled Queries (SSQ) 
 * to determine whether to set a notification.
 */

exports = module.exports = function(logger, config, esClient, Query) {
    // get a collection of all SSQs given the frequency
    // Only SSQs that do not already have a notification are returned
    function findSSQ (period) {
        logger.info('finding saved scheduled queries for %s', period)
        return Query.findAll({
            where: {
                notificationHasRun: true,
                frequency: period
            }
        })
    }

    // given an SSQ, extract the ElasticSearch query state which is stored as
    // text.  Parse the text and reture the query object that is used as the 
    // body of the query.
    function getEsQuery (ssq) {
        var esQuery = {};

        var elasticUIState = JSON.parse(ssq.elasticUIState);
        logger.info(elasticUIState);

        if (elasticUIState.queryState && Object.keys(elasticUIState.queryState).length > 0) {
            esQuery.query = {};
            esQuery.query.query_string = elasticUIState.queryState.query_string;        
        }

        esQuery.fields = ["_timestamp"];
        esQuery.sort = {'_timestamp': {'order': 'desc'}};
        esQuery.size = 1;

        if (elasticUIState.filterState && Object.keys(elasticUIState.filterState).length > 0) {
            esQuery.filter = elasticUIState.filterState;
        }

        logger.info(esQuery);
        return esQuery;
    }


    // given a SSQ: 
    // 1. run the ES query on the elasticsearch index sorted newest first
    // 3. compare most recent result with last run date
    // 4. if new results are available, add a notification
    function runSSQ (periodicSSQfn) {
        return function() {
            return periodicSSQfn()
            .then (function (queries) {
                logger.info(queries);
                queries.forEach(function(query) {
                    var results = {};

                    // query elasticsearch for new records since the last run date
                    esClient.search({
                        index: config.euiSearchIndex,
                        type: config.euiSearchType,
                        body: getEsQuery(query)
                    })
                    .then(function (resp) {
                        
                        logger.info(resp);
                        results = resp;
                        var latestResultDate = new Date(results.hits.hits[0].fields._timestamp);
                        var diff = latestResultDate - query.lastRunDate;
                        
                        logger.info('lastRunDate: %s', query.lastRunDate);

                        if (diff > 0) {
                            query.notificationDateTime = new Date();
                            query.notificationHasRun = false;
                            query.save({fields: ['notificationDateTime', 'notificationHasRun']})
                            .then(function() {
                                logger.info('updated %s', query.name);
                            })
                        }
                    }, function (err) {
                        logger.error(err.message);
                    });
                });   
            })
            .catch(function (err) {
                logger.error (err);
            });         
        }
    }

    var hourlySSQ = function () { return findSSQ('hourly'); }
    var dailySSQ = function() { return findSSQ('daily'); }
    var weeklySSQ = function() { return findSSQ('weekly'); }

    return {
        findSSQ: findSSQ,
        getEsQuery: getEsQuery,
        runSSQ: runSSQ,
        runHourlySSQ: runSSQ (hourlySSQ),
        runDailySSQ: runSSQ (dailySSQ),
        runWeeklySSQ: runSSQ (weeklySSQ),
    }
}
