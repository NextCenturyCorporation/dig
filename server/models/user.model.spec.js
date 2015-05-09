'use strict';

var should = require('should');
var models = require('../models');

describe('User Model', function() {
    models.sequelize.sync().then(function() {
        var testUser = 'testuserwilma';

        var findAndRemoveTestUser = function(done) {
            models.User.find({
                where: {username: testUser}
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

        before(findAndRemoveTestUser);
        afterEach(findAndRemoveTestUser);

        it('should assign default role --user--', function(done) {
            models.User.create({
                username: testUser
            }).then(function (user) {
                user.should.have.property('role', 'user');
                done();
            });
        });

        it('should have no testuser', function (done) {
            models.User.findAll({
                where: {username: testUser}
            }).then(function (users) {
                users.should.have.length(0);
                done();
            });
        });

        it('should not create a duplicate user', function(done) {
            models.User.create({
                username: testUser
            }).then(function (user) {
                models.User.findOrCreate({where: {username: testUser}})
                .spread(function (user, created) {
                    created.should.be.false;
                    done();
                });
            });        
        });        
    });
});
