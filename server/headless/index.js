'use strict'

var schedule = require('node-schedule');


var savedScheduledQueryRunner = function (applog) {
    console.log('Started Saved Scheduled Query Runner');

    return {
        // every hour on the hour
        hourlyJob: schedule.scheduleJob('0 * * * *', function() {
            applog.info('hourly %s', new Date());
        }),

        // midnight every day
        dailyJob: schedule.scheduleJob('0 0 * * *', function() {
            applog.info('daily %s', new Date());
        }),    

        // midnight on Sunday
        weeklyJob: schedule.scheduleJob('0 0 * * 0', function() {
            applog.info('weekly %s', new Date());
        })
    }
};

module.exports = savedScheduledQueryRunner;