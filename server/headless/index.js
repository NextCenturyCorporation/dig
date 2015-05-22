'use strict';

var QueryDB = require('./querydb'),
    schedule = require('node-schedule');
    

// when importing this module, call the function with an instance
// of an application logger such as bunyan.
var savedScheduledQueryRunner = function (applog) {
    applog.info('Started Saved Scheduled Query Runner');
    var querydb = QueryDB(applog);

    return {
        // every hour on the hour
        hourlyJob: schedule.scheduleJob('* * * * *', querydb.runHourlySSQ),

        // midnight every day
        dailyJob: schedule.scheduleJob('0 0 * * *', querydb.rundailySSQ),    

        // midnight on Sunday
        weeklyJob: schedule.scheduleJob('0 0 * * 0', querydb.runWeeklySSQ)
    }
};

module.exports = savedScheduledQueryRunner;