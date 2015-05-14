'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

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
      }
  ];

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
});