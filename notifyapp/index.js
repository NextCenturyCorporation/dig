'use strict';

var QueryDB = require('./querydb'),
    schedule = require('node-schedule');

// when importing this module, call the function with an instance
// of an application logger such as bunyan.
var savedScheduledQueryRunner = function (applog, config, esClient, QueryModel, notificationEmail) {
    applog.info('Started Saved Scheduled Query Runner');
    var querydb = QueryDB(applog, config, esClient, QueryModel);

    return {
        // every hour on the hour
        hourlyJob: schedule.scheduleJob('0 * * * *', querydb.runHourlySSQ),

        // midnight every day
        dailyJob: schedule.scheduleJob('0 0 * * *', querydb.runDailySSQ),    

        // midnight on Sunday
        weeklyJob: schedule.scheduleJob('0 0 * * 0', querydb.runWeeklySSQ)
    }
};

module.exports = savedScheduledQueryRunner;
