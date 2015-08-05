'use strict';

var should = require('should'),
    app = require('../../app'),
    request = require('supertest'),
    User = app.models.User,
    Folder = app.models.Folder,
    FolderItem = app.models.FolderItem;

/* jshint expr: true */
/* global describe, it, before, beforeEach, afterEach */

// Mocha unit tests for folders REST API
describe('folders endpoint', function() {
    function getRootFolder (user) {
        return Folder.find({where: {
            name: 'ROOT',
            hierarchyLevel: 1,
            parentId: null,
            UserUserName: user
        }})
    }

    var testUser = null;
    var folders = null;

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
            return User.create({username: 'test'})
        })
        .then(function(user) {
            return user.createFolder({
                name: 'ROOT',
                hierarchyLevel: 1,
                parentId: null
            });
        })
        .then(function() {
            done();
        })
        .catch(function(err){
            done(err);
        });
    });


    beforeEach(function(done) {
        folders = {};
        var testUser = null;
        User.find({where: {username: 'test'}})
        .then(function(user) {
            testUser = user;
            return testUser.getFolders({where: {
                name: 'ROOT',
                hierarchyLevel: 1,
                parentId: null
            }});
        })
        .then(function(values) {
            folders = {'ROOT': values[0]};

            return app.models.Sequelize.Promise.each([
                {name: 'a', parentName: 'ROOT'},
                {name: 'ab', parentName: 'a'},
                {name: 'ac', parentName: 'a'},
                {name: 'abd', parentName: 'ab'},
                {name: 'abe', parentName: 'ab'},
                {name: 'acd', parentName: 'ac'},
                {name: 'ace', parentName: 'ac'},
                {name: 'abdf', parentName: 'abd'},
                {name: 'abdg', parentName: 'abd'}
            ], function(folderParams) {
                // get parent
                var parent = folders[folderParams.parentName];
                folderParams.parentId = parent.id;

                return testUser.createFolder({
                    name: folderParams.name, parentId: folderParams.parentId
                })
                .then(function(folder) {
                    folders[folder.name] = folder;
                });
            })
            .then(function(){
                done();
            })
            .catch(function(err) {
                done(err);
            });
        })
        .catch(function(err) {
            done(err);
        });
    });

    afterEach(function(done) {
        var descendants = null;
        getRootFolder('test')
        .then(function(folder) {
            return folder.getDescendents();
        })
        .then(function(folders) {
            descendants = folders;        
        })
        .then(function() {
            // set parentId of all folders to null
            // (to avoid foreign constraint error in SQLite when dropping table)
            return Folder.update({parentId: null},
                {where: {parentId: {ne: null}, UserUsername: 'test'}, hooks: false});
        })
        .then(function() {
            return app.models.Sequelize.Promise.each(descendants, function(folder) {
                folder.destroy();
            })
            .then(function() {
                done();
            })
        })
        .catch(function(err) {
            done(err);
        })
    })


    // Return a list of all folders for a given userid (username)
    describe('GET /api/users/:userid/folders', function(done) {
        it('should return the array of folders for user test', function(done) {
            request(app)
            .get('/api/users/test/folders')
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.be.instanceof(Array).and.have.lengthOf(10);
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
                .send({name: 'a', parentId: rootFolder.id})
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


        it('should rename the folder', function(done) {
            request(app)
            .put('/api/users/test/folders/' + folders.ab.id)
            .send({name: 'ab_new', parentId: folders.ab.parentId})
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.have.property('name', 'ab_new');
                res.body.should.have.property('parentId', folders.ab.parentId);
                done();
            });
        });

        it('should prevent updating the ROOT folder', function(done) {
            request(app)
            .put('/api/users/test/folders/' + folders.ROOT.id)
            .send({name: 'hoot', parentId: null})
            .expect(403)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });            
        });

        it('should prevent moving itself to one of its subfolders', function(done) {
            request(app)
            .put('/api/users/test/folders/' + folders.ab.id)
            .send({name: 'a', parentId: folders.abdf.parentId})
            .expect(403)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.have.property('name', 'SequelizeHierarchyError');
                done();
            });            
        });
        
        it('should move the folder up one level', function(done) {
            request(app)
            .put('/api/users/test/folders/' + folders.ab.id)
            .send({name: 'ab', parentId: folders.a.parentId})
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.hierarchyLevel.should.be.exactly(2);
                done();
            });             
        });

        it('should prevent duplicate folder', function(done) {
            request(app)
            .put('/api/users/test/folders/' + folders.ab.id)
            .send({name: 'ac', parentId: folders.ab.parentId})
            .expect(403)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.have.property('name', 'SequelizeUniqueConstraintError');
                done();
            });        
        });
    });

    // Remove a folder recursively
    describe('DELETE /api/users/:userid/folders/:folderid', function() {
        it ('should delete a folder and all its children', function(done) {
            request(app)
            .delete('/api/users/test/folders/' + folders.a.id)
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.affected.should.be.instanceof(Array).and.have.length(9);
                done(); 
            });
        });

        it ('should not delete the ROOT folder', function(done) {
            request(app)
            .delete('/api/users/test/folders/' + folders.ROOT.id)
            .expect(403)
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });                 
        })
    });

    // Create one or more FolderItem objects
    describe('POST /api/users/:userid/folders/:folderid/folderitems', function() {
        it('should create a few items in a folder that exists', function(done) {
            request(app)
            .post('/api/users/test/folders/' + folders.a.id + '/folderitems')
            .send({items: [{elasticId: 'i1'}, {elasticId: 'i2'}, {elasticId: 'i3'}]})
            .expect(201)
            .end(function(err, res) {
                if (err) return done(err);
                console.log(JSON.stringify(res.body));
                res.body.affected.should.be.instanceof(Array).and.have.length(3);
                done();
            });
        });

        it('should fail to create items in a non-existent folder', function(done) {
            request(app)
            .post('/api/users/test/folders/-1/folderitems')
            .send({items: [{elasticId: 'i1'}, {elasticId: 'i2'}, {elasticId: 'i3'}]})
            .expect(403)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.have.property('name', 'AssertionError');
                done();
            });
        });

        it('should fail to create a duplicate item in a folder', function(done) {
            request(app)
            .post('/api/users/test/folders/' + folders.a.id + '/folderitems')
            .send({items: [{elasticId: 'i1'}, {elasticId: 'i1'}, {elasticId: 'i3'}]})
            .expect(403)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.should.have.property('name', 'SequelizeUniqueConstraintError');
                done();
            });            
        });
    });

    // Remove one or more FolderItem objects
    describe('DELETE /api/users/:userid/folders/:folderid/folderitems', function() {
        it('should remove zero items in a folder', function(done) {
            request(app)
            .delete('/api/users/test/folders/' + folders.a.id + '/folderitems')
            .send({items: []})
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.affected.should.be.instanceof(Array).and.have.length(0);
                done();
            });
        });

        it('should remove some items in a folder', function(done) {
            request(app)
            .post('/api/users/test/folders/' + folders.a.id + '/folderitems')
            .send({items: [{elasticId: 'i1'}, {elasticId: 'i2'}, {elasticId: 'i3'}]})
            .expect(200)
            .end(function(err, res) {
                request(app)
                .delete('/api/users/test/folders/' + folders.a.id + '/folderitems')
                .send({items: [{elasticId: 'i1'}, {elasticId: 'i2'}]})
                .expect(200)
                .end(function(err, res) {
                    if (err) return done(err);
                    res.body.affected.should.be.instanceof(Array).and.have.length(2);
                    done();
                });                
            });
        });

        it('should not fail if an item does not exist', function(done) {
            request(app)
            .delete('/api/users/test/folders/' + folders.a.id + '/folderitems')
            .send({items: [{elasticId: 'nope'}, {elasticId: 'not_here'}]})
            .expect(200)
            .end(function(err, res) {
                if (err) return done(err);
                res.body.affected.should.be.instanceof(Array).and.have.length(2);
                done();
            });             
        });
    });
});