'use strict';

var should = require('should');
var models = require('../models');
var elasticsearch = require('elasticsearch');
var QueryDB = require('./querydb');

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

describe('QueryDB Unit Tests', function() {
	var testUser = 'testuserheadless';
	var querydb = QueryDB(applog, config, esClient, models.Query);

    before(function (done) {
        return models.User.sync()
        .then(function() {
            return models.Query.sync()
        })
        .then(function () {
            return models.User.destroy( {
                where: {username: testUser}
            })
        })
        .then(function () {
            return models.User.create({
                username: testUser
            })
        })
        .then(function (user) {
            done();
        })
        .catch (function(err) {
            done(err);
        })
    });

    after(function (done) {
    	return models.User.destroy( {
    		where: {username: testUser}
    	})
    	.then(function () {
    		done();
    	})
    	.catch (function (err) {
    		done(err);
    	})
    });

	describe('findHourlySSQ', function (argument) {
		it('should find zero hourly SSQ', function (done) {
			return querydb.findSSQ('hourly')
			.then(function (queries) {
				queries.length.should.be.within(0,1);
				done();
			})
			.catch(function (err) {
				done(err);
			})
		})
	})
})