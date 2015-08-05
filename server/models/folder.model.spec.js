'use strict';

var should = require('should'),
    assert = require('assert'),
    models = require('./index'),
    User = models.User,
    Folder = models.Folder,
    FolderItem = models.FolderItem,
    Sequelize = models.Sequelize;

var rootFolder = 
{
    name: 'ROOT',
    hierarchyLevel: 1,
    parentId: null
};

function getRootFolder (user) {
    return Folder.find({where: {
        name: 'ROOT',
        hierarchyLevel: 1,
        parentId: null,
        UserUserName: user
    }})
}

/* jshint expr: true */
/* global describe, it, beforeEach, before, afterEach */

describe('Folder Model', function() {
    var testUserName = 'testuserfolder';
    var testUser = {};

    before(function (done) {
        models.sequelize.sync()
        .then(function() {
            // set parentId to null to prevent foreign constraint error
            // when removing testuserfolder
            return Folder.update({parentId: null}, 
                {where: {parentId: {ne: null}}, hooks: false});
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
            return testUser.createFolder(rootFolder)
        })
        .then(function() {
            done();
        })
        .catch (function(err) {
            done(err);
        });
    });

    it('should find ROOT folder for testuserfolder', function(done) {
        testUser.should.be.Object();
        testUser.getFolders.should.be.Function();
        testUser.getFolders({where: rootFolder})
        .then(function(folders) {
            assert.notEqual(folders, null);
            folders.should.be.instanceOf(Array).and.have.lengthOf(1);
            folders[0].getDataValue('name').should.equal('ROOT');
            done();
        })
        .catch(function(err) {
            done(err);
        });
    });

    it('should create a ROOT folder if it does not exist', function(done) {
        testUser.getFolders({where: rootFolder})
        .then(function(folders) {
            folders.should.be.instanceof(Array).and.have.lengthOf(1);
            return folders[0].destroy();
        })
        .then(function() {
            return testUser.getFolders();
        })
        .then(function(folders) {
            folders.should.be.instanceof(Array).and.have.lengthOf(0);
            return testUser.createFolder(rootFolder);
        })
        .then(function(folder) {
            folder.should.have.property('name', 'ROOT');
            done();
        })
        .catch(function(err) {
            done(err);
        });
    });

    it('should find the ROOT folder if it exists', function(done){
        Folder.findOrCreate({where: 
            {
                UserUserName: testUserName,
                name: 'ROOT',
                hierarchyLevel: 1
            }
        })
        .spread(function(folder, created) {
            created.should.be.false();
            done();
        })
        .catch(function(err) {
            done(err);
        });
    });

    it('should return a list of the user folders and folder items', function(done) {
        getRootFolder(testUserName)
        .then(function(folder) {
            return Sequelize.Promise.each([
                {elasticId: 'id1'},
                {elasticId: 'id2'}
            ], function(item) {
                return folder.createFolderItem(item);
            });
        })
        .then(function () {
            return testUser.getFolders({include: [FolderItem]});
        })
        .then(function(folders) {
            assert.notEqual(folders, null);
            folders.length.should.be.above(0);
            folders[0].FolderItems.length.should.be.exactly(2);
            console.log(JSON.stringify(folders));
        })
        .then(function(results) {
            done();
        })
        .catch(function(err) {
            done(err);
        });
    });

    it('should not allow more than one ROOT folder per user', function(done) {
        testUser.createFolder(rootFolder)
        .then(function(folder) {
            throw new Error('expected SequelizeUniqueConstraintError');
        })
        .catch(function(err) {
            err.should.not.be.undefined();
            err.should.have.property('name', 'SequelizeUniqueConstraintError');
            done();
        })
    });

    it ('should create some children folders', function(done) {
        getRootFolder(testUserName)
        .then(function(folder) {
            return Sequelize.Promise.each([
                {fname: 'folder1', parentId: folder.id},
                {fname: 'folder2', parentId: folder.id}
            ], function(newfolder) {
                return testUser.createFolder({
                    name: newfolder.fname,
                    parentId: newfolder.parentId
                });
            })
        })
        .then(function () {
            return testUser.getFolders({
                include: [FolderItem, {model: Folder, as: 'descendents', hierarchy: true}]
            })
        })
        .then(function(folders) {
            assert.notEqual(folders, null);
            folders.length.should.be.above(0);
            folders[0].FolderItems.length.should.be.exactly(2);
            folders[0].children.length.should.be.exactly(2);
            console.log(JSON.stringify(folders));
            done();
        })
        .catch(function(err) {
            done(err);
        })
    });

    it('should not create a folder with non-existent parent', function(done) {
        testUser.createFolder({
            name: 'folder3',
            parentId: 0
        })
        .then(function() {
            throw new Error('expected SequelizeForeignKeyConstraintError');
        })
        .catch(function(err) {
            err.should.have.property('name', 'SequelizeForeignKeyConstraintError');
            done();
        });       
    });
});
