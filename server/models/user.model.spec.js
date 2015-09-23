'use strict';

var should = require('should');
var models = require('./index');

describe('User Model', function() {
    var testUser = 'testuserwilma';

    var findAndRemoveTestUser = function(done) {
        models.User.sync()
        .then(function() {
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
        }).catch(function(err) {
            done(err);
        });
    };

    before(findAndRemoveTestUser);
    afterEach(findAndRemoveTestUser);

    it('should assign default role --user-- and set sendEmailNotification to false', function (done) {
        models.User.create({
            username: testUser
        }).then(function (user) {
            user.should.have.property('sendEmailNotification', false);
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

    it('should not create a duplicate user', function (done) {
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

    it('should set emailAddress if valid', function (done) {
        models.User.create({
            username: testUser, emailAddress: 'valid@email.com'
        }).then(function (user) {
            user.should.have.property('emailAddress', 'valid@email.com');
            done();
        });
    });

    it('should fail to set emailAddress if invalid', function (done) {
        models.User.create({
            username: testUser, emailAddress: 'notvalid'
        }).catch(function (err) {
            err.should.have.property('name', 'SequelizeValidationError');
            done();
        }); 
    });

    it('should set sendEmailNotification to true if emailAddress present and valid', function (done) {
        models.User.create({
            username: testUser, sendEmailNotification: true,  emailAddress: 'valid@email.com'
        }).then(function (user) {
            user.should.have.property('sendEmailNotification', true);
            user.should.have.property('emailAddress', 'valid@email.com');
            done();
        });
    });

    it('should fail to set sendEmailNotification to true if no emailAddress present', function (done) {
        models.User.create({
            username: testUser, sendEmailNotification: true
        }).catch(function (err) {
            err.should.have.property('name', 'SequelizeValidationError');
            done();
        }); 
    });

});
