/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./environment');
var models = require('../models');
var async = require('async');

models.sequelize.sync().then(function () {
    console.log('running seedsql.js ...')

    // remove test user and the associated queries/notifications
    models.User.destroy({
    	where:{username: 'test'}
    }).then(function (users) {
    	models.User.create({username: 'test'})
    	.then(function(user) {
    		models.Query.bulkCreate(serQueries)
    		.then(function() {
	    		models.Query.findAll()
	    		.then(function(queries) {
	    			queries.forEach(function(query) {
	    				query.setUser(user);
	    			})
	    			console.log('adding queries to user test');
	    		});
    		});
    	});
    });
});


var queries = 
[
	{
		name: 'Query #1',
		digState: {
			searchTerms: 'bob smith',
			filters: {"aggFilters":{"city_agg":{"LittleRock":true,"FortSmith":true}},"textFilters":{"phonenumber":{"live":"","submitted":""}},"dateFilters":{"dateCreated":{"beginDate":null,"endDate":null}}},
			selectedSort: {"title":"Best Match","order":"rank"},
			includeMissing: {'aggregations': {}, 'allIncludeMissing': false}
		},
		elasticUIState: {
			queryState:{"query_string":{"fields":["_all"],"query":"bob smith"}}},
			filterState:{"bool":{"should":[{"terms":{"hasFeatureCollection\\uff0eplace_postalAddress_feature\\uff0efeatureObject\\uff0eaddressLocality":["LittleRock"]}},{"terms":{"hasFeatureCollection\\uff0eplace_postalAddress_feature\\uff0efeatureObject\\uff0eaddressLocality":["FortSmith"]}}]}
		},
		frequency: 'never',
		lastRunDate: new Date()
	},
	{
		name: 'Query #2',
		digState: {
			searchTerms: 'jane doe',
			filters: {"textFilters":{"phonenumber":{"live":"","submitted":""}},"dateFilters":{"dateCreated":{"beginDate":"2013-02-02T05:00:00.000Z","endDate":"2015-02-03T05:00:00.000Z"}}},
			selectedSort: {"title":"Best Match","order":"rank"},
			includeMissing: {'aggregations': {}, 'allIncludeMissing': false}
		},
		elasticUIState: {
			queryState: {"query_string":{"query":"jane doe","fields":["_all"]}},
			filterState:{"bool":{"must":[{"range":{"dateCreated":{"from":"2013-02-02"}}},{"range":{"dateCreated":{"to":"2015-02-03"}}}]}}
		},
		frequency: 'hourly',
		lastRunDate: new Date()
	},
	{
		name: 'Query #3',
		digState: {
			searchTerms: 'another users query',
			filters: {"textFilters":{"phonenumber":{"live":"","submitted":""}},"dateFilters":{"dateCreated":{"beginDate":null,"endDate":null}}},
			selectedSort: {"title":"Best Match","order":"rank"},
			includeMissing: {'aggregations': {}, 'allIncludeMissing': false}
		},
		elasticUIState: {
			queryState: {"query_string":{"fields":["_all"],"query":"another users query"}}
		},
		frequency: 'daily',
		lastRunDate: new Date()
	}
];

var serialize = function (query) {
    var serQuery = {};
    serQuery.name = query.name;
    serQuery.frequency = query.frequency;
    serQuery.digState = JSON.stringify(query.digState);
    serQuery.elasticUIState = JSON.stringify(query.elasticUIState);
    return serQuery;
}

var serQueries = []
queries.forEach(function (query) {
	serQueries.push(serialize(query));
});