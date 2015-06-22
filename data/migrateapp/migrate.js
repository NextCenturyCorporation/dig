'use strict';

// Script to be used to migrate query data stored in mongodb to mysql


var mc = require('mongodb').MongoClient,
    assert = require('assert'),
    url = 'mongodb://mongo:27017/dig',
    models = require('./models');

    // connect to mongodb
    mc.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log('connected to db');
        findMongoDbQueries(db, function() {
            db.close();
        });
    });

    // convert the json queries to text so it can be stored in mysql
    function serialize (query) {
        query.digState = JSON.stringify(query.digState);
        query.elasticUIState = JSON.stringify(query.elasticUIState);
        return query;
    }

    function createMySqlQuery (doc) {
        models.User.findOrCreate({
            where: {username: doc.username}
        }).then(function(user) {
            models.Query.create(serialize(doc))
            .then(function(query) {
                query.setUser(doc.username).then(function() {
                    console.log('added query: ', query)
                });
            }).catch(function (error) {
                console.log(error);
            });
        }).catch(function (error) {
            console.log(error);
        });
    };

    function findMongoDbQueries (db, cb) {
        var cursor = db.collection('queries').find();
        // add each mongo SSQ to mysql
        cursor.each(function(err, doc) {
            assert.equal(null, err);
            if (doc != null) {
                createMySqlQuery(doc);
            }
            else {
                cb();
            }
        });
    };
