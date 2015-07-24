'use strict';

var should = require('should'),
    assert = require('assert'),
    models = require('./index'),
    User = models.User,
    Folder = models.Folder,
    FolderItem = models.FolderItem;

describe('Folder Model Unit Tests', function() {
    var testUserName = 'testuserfolder';
    var testUser = {};
    var rootFolder = 
    {
        name: 'ROOT',
        hierarchyLevel: 1
    };

    before(function (done) {
        User.sync()
        .then(function() {
            return Folder.sync();
        })
        .then(function() {
            return FolderItem.sync();
        })
        .then(function () {
            return User.destroy( {
                where: {username: testUserName}
            });
        })
        .then(function () {
            return User.create({
                username: testUserName
            });
        })
        .then(function(user) {
            testUser = user;
            return Folder.create(rootFolder)
        })
        .then(function(folder) {
            return testUser.setRootFolder(folder);
        })
        .then(function() {
            return testUser.getRootFolder();
        })
        .then(function() {
            done();
        })
        .catch (function(err) {
            done(err);
        });
    });

    it('should find ROOT folder for testuserfolder', function(done) {
        testUser.getRootFolder()
        .then(function(folder) {
            assert.notEqual(folder, null);
            folder.getDataValue('name').should.equal('ROOT');
            done();
        })
        .catch(function(err) {
            done(err);
        });
    });

    it('should get a list of folders for one user', function(done) {
        Folder.find({
            where: rootFolder,
            include: [FolderItem]
        })
        .then(function(folder) {
            assert.notEqual(folder, null);
            done();
        })
        .catch(function(err) {
            done(err);
        });
    });

    it('should create a ROOT folder if it does not exist', function(done) {
        testUser
        .getRootFolder()
        // .destroy()
        .then(function(folder) {
            return folder.destroy();
        })
        .then(function(folder) {
            done();
        })
        .catch(function(err) {
            done(err);
        });
    });

});
