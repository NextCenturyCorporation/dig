'use strict';
var elasticsearch = require('elasticsearch'),
    schedule = require('node-schedule'),
    models = require('../models');

// get a logger
var bunyan = require('bunyan');
var applog = bunyan.createLogger({
    name: 'Saved Scheduled Query Runner',
    streams: [{
        type: 'rotating-file',
        path: 'headlessqueryrunner.log',
        period: '1d',
        count: 10
        // `type: 'file'` is implied
    }]
});

// class for elasticsearch client
function LogToBunyan(config) {
    this.error = applog.error.bind(applog);
    this.warning = applog.warn.bind(applog);
    this.info = applog.info.bind(applog);
    this.debug = applog.debug.bind(applog);
    this.trace = function (method, requestUrl, body, responseBody, responseStatus) {
        applog.trace({
            method: method,
            requestUrl: requestUrl,
            body: body,
            responseBody: responseBody,
            responseStatus: responseStatus
        });
    };
    this.close = function () { /* bunyan's loggers do not need to be closed */ }
}
   
// configure elasticsearch client and make a new connection
var esauth = null;
if (process.env.ES_USER && process.env.ES_PASS) {
    esauth = process.env.ES_USER + ':' + process.env.ES_PASS;
}

var esClient = new elasticsearch.Client({
    host: {
        host: process.env.EUI_SERVER || 'localhost',
        port: process.env.EUI_SERVER_PORT || 9200,
        auth: esauth
    },
    log: LogToBunyan
});



// route sequelize output to log
models.sequelize.options.logging=function(loginfo) {
    applog.info(loginfo);
}

// initialize configuration for elasticsearch queries
var config = {};
config.euiSearchIndex = process.env.EUI_SEARCH_INDEX || 'mockads';
config.euiSearchType = process.env.EUI_SEARCH_TYPE || 'ad';

// direct elasticsearch logging to injected logger

var offlineQueryRunner = require('./index');

var runners = offlineQueryRunner(applog, config, esClient, models.Query);
