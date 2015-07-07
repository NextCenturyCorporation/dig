/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./environment');
var models = require('../models');

console.log('running seedsql.js ...')
models.sequelize.sync()
// remove user 'test' and the associated queries/notifications
.then(function () {
    
    return models.User.destroy({ where:{username: 'test'}})
})
// create user test
.then(function () {
    return models.User.create({username: 'test'})
})
// create each query
.then(function(user) {
    console.log('adding queries to user test');
    queries.forEach(function(query) {
        models.Query.create(serialize(query))
        // update foreign key UserUserName for this query to 'test'
        .then(function(queryInstance) {
            queryInstance.setUser(user);
        });
    });
})
.catch(function(error) {
    console.log(error);
});


var queries = 
[
	{
		name: 'Query #1',
		digState: {
			searchTerms: 'did sail',
			filters: {"aggFilters":{"state_agg":{"ga":true,"tx":true,"co":true,"ca":true},"etn_agg":{},"hc_agg":{},"age_agg":{}},"textFilters":{},"dateFilters":{"date":{"beginDate":null,"endDate":null}}},
			selectedSort: {"title":"Best Match","order":"desc","field":"_score"},
			includeMissing: {"aggregations":{},"allIncludeMissing":false}
		},
		elasticUIState: {
			queryState:{"query_string":{"query":"did sail","fields":["_all"]}},
			filterState:{"bool":{"should":[{"terms":{"state":["ga"]}},{"terms":{"state":["tx"]}},{"terms":{"state":["co"]}},{"terms":{"state":["ca"]}}]}}
		},
		frequency: 'never',
		lastRunDate: new Date(),
        notificationHasRun: true
	},
	{
		name: 'Query #2',
		digState: {
			searchTerms: 'ship',
			filters: {"aggFilters":{"state_agg":{},"etn_agg":{},"hc_agg":{},"age_agg":{}},"textFilters":{},"dateFilters":{"date":{"beginDate":"2013-12-01T05:00:00.000Z","endDate":"2013-12-31T05:00:00.000Z"}}},
			selectedSort: {"title":"Best Match","order":"desc","field":"_score"},
			includeMissing: {"aggregations":{},"allIncludeMissing":false}
		},
		elasticUIState: {
			queryState: {"query_string":{"query":"ship","fields":["_all"]}},
			filterState:{"bool":{"must":[{"range":{"date":{"from":"2013-12-01"}}},{"range":{"date":{"to":"2013-12-31"}}}]}}
		},
		frequency: 'hourly',
		lastRunDate: new Date(),
        notificationHasRun: true
	},
	{
		name: 'Query #3',
		digState: {
			searchTerms: 'another saved query',
			filters: {"aggFilters":{"state_agg":{},"etn_agg":{},"hc_agg":{},"age_agg":{}},"textFilters":{},"dateFilters":{"date":{"beginDate":null,"endDate":null}}},
			selectedSort: {"title":"Best Match","order":"desc","field":"_score"},
			includeMissing: {"aggregations":{},"allIncludeMissing":false}
		},
		elasticUIState: {
			queryState: {"query_string":{"query":"another users query","fields":["_all"]}},
            filterState: {}
		},
		frequency: 'daily',
		lastRunDate: new Date("May 2, 2015 00:00:00"),
        notificationHasRun: false
	}
];

var serialize = function (query) {
    query.digState = JSON.stringify(query.digState);
    query.elasticUIState = JSON.stringify(query.elasticUIState);
    return query;
}
