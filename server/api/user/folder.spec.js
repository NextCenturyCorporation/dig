'use strict';

var should = require('should'),
    app = require('../../app'),
    request = require('supertest'),
    User = app.models.User,
    Folder = app.models.Folder,
    FolderItem = app.models.FolderItem,
    Promise = app.models.Sequelize.Promise;

// Mocha unit tests for folders REST API
describe('folders endpoint', function() {
    function getRootFolder (user) {
        return Folder.find({where: {
            name: 'ROOT',
            hierarchyLevel: 1,
            parentId: null,
            UserUserName: user
        }})
    };

    // Remove the test user and all of its folders in the db
    before(function(done) {
        app.models.sequelize.sync()
        .then(function() {
            // set parentId to null to prevent foreign constraint error
            // when removing testuserfolder
            return Folder.update({parentId: null}, 
                {where: {parentId: {ne: null}}, hooks: false});
        })
        .then(function () {
            return User.destroy({
                where: {username: 'test'}
            });
        })
        .then(function() {
            done();
        })
        .catch(function(err){
            done(err);
        });
    });

    // Return a list of all folders for a given userid (username)
    describe('GET /api/users/:userid/folders', function(done) {
        it('should return the array of folders for user test', function(done) {
            request(app)
            .get('/api/users/test/folders')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                res.body[0].should.be.instanceof(Object).and.have.property('name', 'ROOT');
                done();
            });
        });
    });

    // Return a specific Folder object for a given :folderid
    describe('GET /api/users/:userid/folders/:folderid', function(done) {
        it('should return ROOT folder object', function(done) {
            getRootFolder('test')
            .then(function(rootFolder){
                request(app)
                .get('/api/users/test/folders/' + rootFolder.id)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    res.body.should.be.instanceof(Object).and.have.property('name', 'ROOT');
                    res.body.children.should.be.instanceof(Array);
                    res.body.FolderItems.should.be.instanceof(Array);
                    done();
                });                
            })
            .catch(function(err) {
                done(err);
            });
        });

        it('should return error on non-existent folder', function(done) {
            request(app)
            .get('/api/pfolders/0')
            .expect(404, done);
        });        
    })
    
    // Create a new Folder object
    describe('POST /api/users/:userid/folders', function() {
        it('create a new folder f1 under ROOT', function(done) {
            getRootFolder('test')
            .then(function(rootFolder){
                request(app)
                .post('/api/users/test/folders')
                .send({name: 'f1', parentId: rootFolder.id})
                .expect(201)
                .end(function(err, res) {
                    if (err) return done(err);
                    done();
                });
            });
        });

        it('should find f1 folder under ROOT', function(done) {
            getRootFolder('test')
            .then(function(rootFolder){
                request(app)
                .get('/api/users/test/folders/' + rootFolder.id)
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    res.body.should.be.instanceof(Object).and.have.property('name', 'ROOT');
                    res.body.children.should.be.instanceof(Array);
                    res.body.FolderItems.should.be.instanceof(Array);
                    //console.log(JSON.stringify(res.body));
                    done();
                });                
            })
            .catch(function(err) {
                done(err);
            });
        });

        it('should not create identical folder', function(done) {
            getRootFolder('test')
            .then(function(rootFolder){
                request(app)
                .post('/api/users/test/folders')
                .send({name: 'f1', parentId: rootFolder.id})
                .expect(403)
                .end(function(err, res) {
                    if (err) return done(err);
                    res.body.should.have.property('name', 'SequelizeUniqueConstraintError');
                    done();
                });
            });
        });

        it('should not create a folder with non-existent parent', function(done) {
            request(app)
            .post('/api/users/test/folders')
            .send({name: 'f2', parentId: 0})
            .expect(403)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.have.property('name', 'SequelizeForeignKeyConstraintError');
                done();
            });
        });
    });

    // Update a folder: 1) name, 2) parentId, 3) hierarchyLevel
    describe('PUT /api/users/:userid/folders/:folderid', function() {
        beforeEach(function(done) {
            console.log('hey');
        });

        it('should move the folder down one level');
        it('should move the folder up one level');
        it('should move the folder up two levels');
        it('should move the folder down two levels');
        it('should keep FolderItems the same after changing parentId');
        it('should rename the folder');
        it('should prevent renaming a folder to one that already exists at same level');
    });


    // Remove all folders
    describe('DELETE /api/users/:userid/folders', function() {

    });

    // Remove a folder recursively
    describe('DELETE /api/users/:userid/folders/:folderid', function() {

    });

    // Create one or more FolderItem objects
    describe('POST /api/users/:userid/folders/:folderid/folderitems', function() {

    });

    // Remove one or more FolderItem objects
    describe('DELETE /api/users/:userid/folders/:folderid/folderitems', function() {

    });
});