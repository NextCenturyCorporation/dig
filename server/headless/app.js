'use strict'
var bunyan = require('bunyan');

var applog = bunyan.createLogger({
        name: 'Saved Scheduled Query Runner',
        streams: [{
            path: 'offlinequery.log',
            // `type: 'file'` is implied
        }]
    });

var app = require('./index.js')(applog);
console.log('started offline SSQ');