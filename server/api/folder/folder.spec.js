'use strict';

// NOTE: The tests must be run in the order shown or it will break the tests.

var should = require('should');
var app = require('../../app');
var request = require('supertest');

var rootFolderInitial = {
      _id: 0,
      username: "test",
      name: "ROOT",
      childIds: []
    };

var folders = [
    {
      username: "test",
      name: "folderChild",
      parentId: 0,
      childIds: []
    },{
      username: "test",
      name: "folderParent",
      parentId: 0,
      childIds: [1]
    },{
      username: "test",
      name: "folderGrandparent",
      parentId: 0,
      childIds: [2]
    },
    {
      username: "test",
      name: "folderSibling",
      parentId: 2,
      childIds: []
    },
    {
      username: "test",
      name: "folderGreatGP",
      parentId: 0,
      childIds: []
    }
];

describe('GET /api/folders', function() {

  it('should return ROOT on creation', function(done) {
    request(app)
      .get('/api/folders')
      .set('user', 'test')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array).and.have.lengthOf(1);
        res.body[0].should.be.instanceof(Object).and.have.property('name', 'ROOT');
        done();
      });
  });

  it('should not be able to retrieve other user\'s folders', function(done) {
    request(app)
      .get('/api/folders')
      .set('user', 'test1')
      .expect(404, done);
  });
});

describe('GET /api/folders/:id', function() {

  it('should return object', function(done) {
    request(app)
      .get('/api/folders/0')
      .set('user', 'test')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Object).and.have.property('name', 'ROOT');
        done();
      });
  });

  it('should not be able to retrieve other user\'s folder', function(done) {
    request(app)
      .get('/api/folders/0')
      .set('user', 'test1')
      .expect(404, done);
  });

  it('should return error on non-existent folder', function(done) {
    request(app)
      .get('/api/folders/1')
      .set('user', 'test')
      .expect(404, done);
  });
});

describe('POST /api/folders', function() {

  it('should not be able to add to other user\'s folders', function(done) {
    request(app)
      .post('/api/folders')
      .set('user', 'test1')
      .set('Content-Type','application/json')
      .send(folders[0])
      .expect(404, done);
  });

  it('should not be able to add folder with name ROOT', function(done) {
    request(app)
      .post('/api/folders')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .send(rootFolderInitial)
      .expect(404, done);
  });

  it('should not be able to add folder with self as parent', function(done) {
    request(app)
      .post('/api/folders')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .send({
        username: "test",
        name: "folderChild",
        parentId: 1,
        childIds: []
      })
      .expect(404, done);
  });

  it('should not be able to add folder with unknown parent', function(done) {
    request(app)
      .post('/api/folders')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .send({
        username: "test",
        name: "folderChild",
        parentId: 2,
        childIds: []
      })
      .expect(404, done);
  });

  it('should not be able to add folder with self as child', function(done) {
    request(app)
      .post('/api/folders')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .send({
        username: "test",
        name: "folderChild",
        parentId: 1,
        childIds: []
      })
      .expect(404, done);
  });

  it('should add single folder to ROOT', function(done) {
    // Create folderChild
    request(app)
      .post('/api/folders')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .send(folders[0])
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.containDeep(folders[0]);
        res.body.should.have.property('_id', 1);
      });

    // ROOT should have folderChild as a child
    request(app)
      .get('/api/folders/0')
      .set('user', 'test')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.childIds.should.eql([1]);
        done();
      });
  });

  it('should move existing folder to newly created folder', function(done) {
    // Create folderParent
    request(app)
      .post('/api/folders')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .send(folders[1])
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.childIds.should.eql([1]);
        res.body.parentId.should.eql(0);
        res.body.should.have.property('_id', 2);
      });

    // folderChild should now have parent folderParent, not ROOT
    request(app)
      .get('/api/folders/1')
      .set('user', 'test')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.parentId.should.eql(2);
      });

    // ROOT should have 1 child (folderParent)
    request(app)
      .get('/api/folders/0')
      .set('user', 'test')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.childIds.should.eql([2]);
        done();
      });
  });
  
  it('should move existing folder and all contents to newly created folder', function(done) {
    // Create folderGrandparent
    request(app)
      .post('/api/folders')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .send(folders[2])
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.childIds.should.eql([2]);
        res.body.parentId.should.eql(0);
        res.body.should.have.property('_id', 3);
      });

    // folderParent should now have parent folderGrandparent, not ROOT
    request(app)
      .get('/api/folders/2')
      .set('user', 'test')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.parentId.should.eql(3);
      });

    // folderChild should still have parent folderParent
    request(app)
      .get('/api/folders/1')
      .set('user', 'test')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.parentId.should.eql(2);
      });

    // ROOT should have 1 child (folderGrandparent)
    request(app)
      .get('/api/folders/0')
      .set('user', 'test')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.childIds.should.eql([3]);
        done();
      });
  });
  
  it('should add single folder to existing folder', function(done) {
    // Create folderSibling
    request(app)
      .post('/api/folders')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .send(folders[3])
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.containDeep(folders[3]);
        res.body.should.have.property('_id', 4);
      });

    // folderParent should now have 2 children (folderChild and folderSibling)
    request(app)
      .get('/api/folders/2')
      .set('user', 'test')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.childIds.should.eql([1, 4]);
        done();
      });
  });
  
  it('should not be able to move a folder within its contents', function(done) {
    request(app)
      .post('/api/folders')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .send({
        username: "test",
        name: "folderGreatGP",
        parentId: 1,
        childIds: [2]
      })
      .expect(404, done);
  });
});

describe('PUT /api/folders/:id', function() {

  it('should not be able to change another user\'s folders', function(done) {
    request(app)
      .put('/api/folders/0')
      .set('user', 'test1')
      .set('Content-Type','application/json')
      .send(rootFolderInitial)
      .expect(404, done);
  });

  it('should not be able to change ROOT folder', function(done) {
    request(app)
      .put('/api/folders/0')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .send(rootFolderInitial)
      .expect(404, done);
  });

  it('should not be able to change ROOT folder\'s name', function(done) {
    request(app)
      .put('/api/folders/0')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .send({
        _id: 0,
        username: "test",
        name: "ROOT2",
        childIds: []
      })
      .expect(404, done);
  });

  it('should not be able to change a folder to name ROOT', function(done) {
    // Add new folder
    request(app)
      .post('/api/folders')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .send(folders[0])
      .expect(200);

    // Try to change the new folder's name to ROOT
    request(app)
      .put('/api/folders/1')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .send({
        name: "ROOT",
        parentId: 0,
        childIds: []
      })
      .expect(404, done);
  });

  it('should not be able to change self as its parent', function(done) {
    request(app)
      .put('/api/folders')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .send(folders[3])
      .expect(404, done);
  });

  it('should not be able to change to unknown parent', function(done) {
    request(app)
      .put('/api/folders')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .send({
        username: "test",
        name: "folderSibling",
        parentId: 4,
        childIds: []
      })
      .expect(404, done);
  });

  it('should not be able to change self as its child', function(done) {
    request(app)
      .put('/api/folders')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .send({
        username: "test",
        name: "folderSibling",
        parentId: 2,
        childIds: [4]
      })
      .expect(404, done);
  });

  it('should return error on unknown id', function(done) {
    request(app)
      .put('/api/folders/5')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .send(folders[0])
      .expect(404, done);
  });

  it('should change folder name', function(done) {
    var newName = "folderChild1";
    var folder = folders[0];

    // Change parentId to match what's in the system and make new name
    folder.parentId = 2;
    folder.name = newName;

    // Update with new name
    request(app)
      .put('/api/folders/1')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .send(folder)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.name.should.eql(newName);
        done();
      });
  });

  it('should move single folder to another existing folder', function(done) {
    var folder = folders[3];
    folder.parentId = 3;

    request(app)
      .put('/api/folders/4')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .send(folders[3])
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.name.should.eql(folder.name);
        res.body.parentId.should.eql(folder.parentId);
      });

    // Check new parent for child folder reference
    request(app)
      .get('/api/folders/3')
      .set('user', 'test')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.childIds.should.containEql(4);
      });

    // Check old parent for removal of folderSibling in childIds
    request(app)
      .get('/api/folders/2')
      .set('user', 'test')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.childIds.should.eql(folders[1].childIds);
        done();
      });
  });

  it('should move folder, with new name, and all contents to another folder', function(done) {
    // Create new folder folderGreatGP
    request(app)
      .post('/api/folders')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .send(folders[4])
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.containEql(folders[4]);
      });

    var newName = "folderGrandparent1";
    var folder = folders[2];
    folder.parentId = 5;
    folder.childIds = [2, 4];
    folder.name = newName;

    // Move folderGrandparent to folderGreatGP and change name to folderGrandparent1
    request(app)
      .put('/api/folders/3')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .send(folder)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.parentId.should.eql(5);
        res.body.childIds.should.eql([2, 4]);
        res.body.name.should.eql(newName);
      });

    // Check ROOT for change of childIds
    request(app)
      .get('/api/folders/0')
      .set('user', 'test')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.childIds.should.eql([5]);
      });

    // Check folderGreatGP for new childIds
    request(app)
      .get('/api/folders/5')
      .set('user', 'test')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.childIds.should.eql([3]);
      });

    // Check folderParent didn't change
    request(app)
      .get('/api/folders/2')
      .set('user', 'test')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.childIds.should.eql([1]);
        res.body.parentId.should.eql(3);
      });

    // Check folderSibling didn't change
    request(app)
      .get('/api/folders/4')
      .set('user', 'test')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.childIds.should.eql([]);
        res.body.parentId.should.eql(3);
      });

    // Check folderChild didn't change
    request(app)
      .get('/api/folders/1')
      .set('user', 'test')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.childIds.should.eql([]);
        res.body.parentId.should.eql(2);
        done();
      });
  });
  
  it('should not be able to move a folder within its contents', function(done) {
    request(app)
      .put('/api/folders')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .send({
        username: "test",
        name: "folderGreatGP",
        parentId: 4,
        childIds: [3]
      })
      .expect(404, done);
  });
});

describe('DELETE /api/folders/:id', function() {

  it('should not be able to delete another user\'s folders', function(done) {
    request(app)
      .delete('/api/folders/1')
      .set('user', 'test1')
      .expect(404, done);
  });

  it('should not be able to delete ROOT folder', function(done) {
    request(app)
      .delete('/api/folders/0')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .expect(404, done);
  });

  it('should delete single folder that has no children', function(done) {
    // Delete folderChild
    request(app)
      .delete('/api/folders/1')
      .set('user', 'test')
      .set('Content-Type','application/json')
      .expect(204)
      .end(function(err) {
        if (err) return done(err);
      });

    // folderChild shouldn't exist anymore
    request(app)
      .get('/api/folders/1')
      .set('user', 'test')
      .expect(404);

    // Check folderParent doesn't have children anymore
    request(app)
      .get('/api/folders/2')
      .set('user', 'test')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.childIds.should.eql([]);
        done();
      });
  });

  it('should delete everything', function(done) {
    // Delete folderGreatGP
    request(app)
      .delete('/api/folders/5')
      .set('user', 'test')
      .expect(204)
      .end(function(err, res) {
        if (err) return done(err);
      });

    // Only ROOT should exist in the system now
    request(app)
      .get('/api/folders')
      .set('user', 'test')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.have.lengthOf(1);
        res.body[0].childIds.should.eql([]);
        res.body[0].name.should.eql("ROOT");
        done();
      });
  });
});