'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
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
        models.Query.sync()
        .then(function () {
            done();
        }).catch (function(err) {
            done(err);
        })
    });


    it('should create a query', function (done) {
        models.Query.create(testquery)
        .then(function (query) {
            query.notificationHasRun.should.be.true;
            query.destroy().then(function(){
                done();
            }).catch(function(err) {
                done(err);
            });
        });
    });

});
