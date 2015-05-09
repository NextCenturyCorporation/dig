'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = app.models.User;

describe('/api/appusers', function() {
    var testUser = 'testuserernest';

    describe('POST /api/appusers', function() {
        it('should return created user', function (done) {
            request(app)
            .post('/api/appusers')
            .send({username: testUser})
            .expect(201)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
        });        
    });
    
    describe('GET /api/appusers', function() {
        it('should respond with JSON array', function (done) {
            request(app)
            .get('/api/appusers')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Array);
                res.body.length.should.be.above(0);
                done();
            });
        });
    });

    describe('GET /api/appusers/:username', function() {
        it('should find and return the user', function (done) {
            request(app)
            .get('/api/appusers/' + testUser)
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.username.should.be.exactly(testUser);
                res.body.role.should.be.exactly('user');
                done();
            });
        });
    });

    describe('PUT /api/appusers/:username', function() {
        it('should find and update the user role', function(done) {
            request(app)
            .put('/api/appusers/' + testUser)
            .send({role: "disabled"})
            .expect(204)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
        });
    });

    describe('DELETE /api/appusers/:username', function() {
        it('should find and delete the user', function (done) {
            request(app)
            .delete('/api/appusers/' + testUser)
            .expect(204)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
        });
    });

    describe('DELETE /api/appusers/:username', function() {
        it('should NOT find and delete the user', function (done) {
            request(app)
            .delete('/api/appusers/xxxxxxxxxxxxxx')
            .expect(404)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
        });
    });

    describe('GET /api/appusers/:username/notifications/count', function() {
        it ('should return number of notifications (0)', function (done) {
            request(app)
            .get('/api/appusers/' + testUser + '/notifications/count')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                res.body.notRunCount.should.be.exactly(0);
                done();
            })
        })
    })
});