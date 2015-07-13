'use strict';

var should = require('should');
var models = require('./index');

describe('Folder Model', function() {
    var testUser = 'testuserfolder';

    before(function (done) {
        return models.User.sync()
        .then(function() {
            return models.Folder.sync();
        })
        .then(function() {
            return models.FolderItem.sync();
        })
        .then(function () {
            return models.User.destroy( {
                where: {username: testUser}
            });
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

    it('should create a folder');
     
});
