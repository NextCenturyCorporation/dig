'use strict';

var should = require('should');
var app = require('../../app');
var models = require('../../models');


describe('User Model', function() {

    var findAndRemoveBob = function(done) {
        models.User.find({
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
    };

    before(findAndRemoveBob);

    it('should assign default role --user--', function(done) {
        models.User.create({
            username: 'testuserbob'
        }).then(function (user) {
            user.should.have.property('role', 'user');
            done();
        });
    });

    it('should have no testuserbob', function (done) {
        models.User.findAll({
            where: {username: 'testuserbob'}
        }).then(function (users) {
            users.should.have.length(0);
            done();
        });
    });

    it('should not create a duplicate user', function(done) {
        models.User.create({
            username: 'testuserbob'
        }).then(function (user) {
            models.User.findOrCreate({where: {username: 'testuserbob'}})
            .spread(function (user, created) {
                created.should.be.false;
                done();
            });
        });        
    });

    afterEach(findAndRemoveBob);
});