/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Query = require('../api/query/query.model');


User.find({}).remove(function() {
  User.create({
    provider: 'local',
    role: 'user',
    name: 'Test User',
    email: 'test@test.com'
  }, function() {
      console.log('finished populating users');
    }
  );
});

Query.find({}).remove(function() {
  Query.create({
    name: 'Query #1',
    searchTerms: 'bob smith',
    filters: 'City/Region: DC',
    email: 'test@test.com',
    frequency: 'weekly',
    createDate: new Date(),
    lastRunDate: new Date()
  }, {
    name: 'Query #2',
    searchTerms: 'jane doe',
    filters: ['City/Region: VA', 'City/Region: DC'],
    email: 'test@test.com',
    frequency: 'daily',
    createDate: new Date(),
    lastRunDate: new Date()
  }, {
    name: 'Query #3',
    searchTerms: 'another users query',
    filters: 'City/Region: nowhere',
    email: 'test2@test.com',
    frequency: 'weekly',
    createDate: new Date(),
    lastRunDate: new Date()
  }, function() {
      console.log('finished populating queries');
    }
  );
});