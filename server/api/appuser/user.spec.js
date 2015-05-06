'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var User = app.models.User;

describe('/api/appusers', function() {

    before(function (done) {
        User.find({
            where: {username: 'testuserbob'}
        }).then(function(user) {
            if (user) {
                user.destroy()
                .then(function(){
                    done();
                });
            }
            else {
                done();
            }
        });
    });

    describe('POST /api/appusers', function() {
        it('should return created user', function(done) {
            request(app)
            .post('/api/appusers')
            .send({username: "testuserbob"})
            .expect(201)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
        });        
    });
    
    describe('GET /api/appusers', function() {
        it('should respond with JSON array', function(done) {
            request(app)
            .get('/api/appusers')
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

    describe('GET /api/appusers/:username', function() {
        it('should find and return the user', function(done) {
            request(app)
            .get('/api/appusers/testuserbob')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.username.should.be.exactly('testuserbob');
                res.body.role.should.be.exactly('user');
                done();
            });
        });
    });

    describe('PUT /api/appusers/:username', function() {
        it('should find and update the user role', function(done) {
            request(app)
            .put('/api/appusers/testuserbob')
            .send({role: "disabled"})
            .expect(204)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
        });
    });

    describe('DELETE /api/appusers/:username', function() {
        it('should find and delete the user', function(done) {
            request(app)
            .delete('/api/appusers/testuserbob')
            .expect(204)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
        });
    });

    describe('DELETE /api/appusers/:username', function() {
        it('should NOT find and delete the user', function(done) {
            request(app)
            .delete('/api/appusers/xxxxxxxxxxxxxx')
            .expect(404)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
        });
    });
});