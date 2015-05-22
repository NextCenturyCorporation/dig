'use strict';

// Set default node environment to development
if (process.env.NODE_ENV === 'test') {
    process.env.DB_PASS='digdig';
    process.env.DB_HOST='localhost';
}
else {
    process.env.NODE_ENV = process.env.NODE_ENV || 'development';
}
var config = require('../config/environment');
var should = require('should');
var models = require('./index');

describe('Query Model', function() {
    var testUser = 'testuserpedro';

    var serialize = function (query) {
        query.digState = JSON.stringify(query.digState);
        query.elasticUIState = JSON.stringify(query.elasticUIState);
        return query;
    }

    var testquery = serialize({
        name: 'test query',
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
    })


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


    it('should create a query', function (done) {
        return models.Query.create(testquery)
        .then(function (query) {
            query.notificationHasRun.should.be.true;
            return query.setUser(testUser);
        })
        .then(function() {
            done();
        })
        .catch(function(err) {
            done(err);
        });
    });

});
