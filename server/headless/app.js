'use strict';

var bunyan = require('bunyan');

var applog = bunyan.createLogger({
    name: 'Saved Scheduled Query Runner',
    streams: [{
        path: 'offlinequery.log',
        // `type: 'file'` is implied
    }]
});

var offlineQueryRunner = require('./index');

offlineQueryRunner(applog);
