'use strict';
var elasticsearch = require('elasticsearch'),
    schedule = require('node-schedule'),
    models = require('../models');
    
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
    log:'info'
});

// get a logger
var bunyan = require('bunyan');
var applog = bunyan.createLogger({
    name: 'Saved Scheduled Query Runner',
    streams: [{
        path: 'queryrunnertest.log',
        // `type: 'file'` is implied
    }]
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
