'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = app.models.User;
var Query = app.models.Query;

describe('saved queries', function() {
    var testUser = 'testuserbob';

    // remove the test user and all queries (cascade delete)
    after(function(done){
        User.destroy({
            where: {username: testUser}
        })
        .then(function() {
            done();
        })
        .catch(function (error) {
            done(error);
        });
    });

    describe('POST /api/appusers', function() {
        it('should return created user', function(done) {
            request(app)
            .post('/api/appusers')
            .send({username: testUser})
            .expect(201)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
        });        
    });

    // create a query for this user
    describe('POST /api/appusers/:username/queries', function() {
        it('should return created query', function(done) {
            request(app)
            .post('/api/appusers/' + testUser + '/queries')
            .send(
            {
                name: "query 1",
                digState: {age: 3, name: "bob"},
                elasticUIState: {age: 3, name: "bob"},
                frequency: "hourly"
            })
            .expect(201)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.name.should.be.exactly('query 1');
                console.log(res.body);
                done();
            });
        });        
    });
    
    describe('GET /api/appusers/:username/queries', function() {
        it('should respond with JSON array', function(done) {
            request(app)
            .get('/api/appusers/' + testUser + '/queries')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Array);
                res.body.length.should.be.above(0);
                done();
            });
        });
    });

    describe.skip('GET /api/appusers/queries/:queryid', function() {
        it('should find and return the query', function(done) {
            request(app)
            .get('/api/appusers/queries/1')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.frequency.should.be.exactly('hourly');
                res.body.name.should.be.exactly('query 1');
                done();
            });
        });
    });

    describe('PUT /api/appusers/queries/:queryid', function() {
        it('should find and update the query', function(done) {
            request(app)
            .put('/api/appusers/queries/1')
            .send({frequency: "never"})
            .expect(204)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
        });
    });

    describe.skip('DELETE /api/appusers/queries/:queryid', function() {
        it('should find and delete the query', function(done) {
            request(app)
            .delete('/api/appusers/queries/1')
            .expect(204)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
        });
    });

});