'use strict';

var querydb = require('./querydb2');
var schedule = require('node-schedule');

// when importing this module, call the function with an instance
// of an application logger such as bunyan.
var savedScheduledQueryRunner = function (applog) {
    console.log('Started Saved Scheduled Query Runner');

    return {
        // every hour on the hour
        hourlyJob: schedule.scheduleJob('0 * * * *', querydb.runHourlySSQ),

        // midnight every day
        dailyJob: schedule.scheduleJob('0 0 * * *', querydb.rundailySSQ),    

        // midnight on Sunday
        weeklyJob: schedule.scheduleJob('0 0 * * 0', querydb.runWeeklySSQ)
    }
};

module.exports = savedScheduledQueryRunner;