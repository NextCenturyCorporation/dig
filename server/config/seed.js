/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Query = require('../api/query/query.model');
var Notification = require('../api/notification/notification.model');


User.find({}).remove(function() {
  User.create({
    provider: 'local',
    role: 'user',
    name: 'Test User',
    username: 'test',
    notificationCount: 2
  }, function() {
      console.log('finished populating users');
    }
  );
});

Query.find({}).remove(function() {
  Query.create({
    _id: '55366684f6867d4715f4f9e9',
    name: 'Query #1',
    searchTerms: 'bob smith',
    filters: {"aggFilters":{"city_agg":{"LittleRock":true,"FortSmith":true}},"textFilters":{"phonenumber":{"live":"","submitted":""}},"dateFilters":{"dateCreated":{"beginDate":null,"endDate":null}}},
    username: 'test',
    frequency: 'weekly',
    selectedSort: {"title":"Best Match","order":"rank"},
    includeMissing: {'aggregations': {}, 'allIncludeMissing': false},
    createDate: new Date(),
    lastRunDate: new Date()
  }, {
    _id: '55366684f6867d4715f4f9ea',
    name: 'Query #2',
    searchTerms: 'jane doe',
    filters: {"textFilters":{"phonenumber":{"live":"","submitted":""}},"dateFilters":{"dateCreated":{"beginDate":"2013-02-02T05:00:00.000Z","endDate":"2015-02-03T05:00:00.000Z"}}},
    username: 'test',
    frequency: 'daily',
    selectedSort: {"title":"Best Match","order":"rank"},
    includeMissing: {'aggregations': {}, 'allIncludeMissing': false},
    createDate: new Date(),
    lastRunDate: new Date()
  }, {
    _id: '55366684f6867d4715f4f9eb',
    name: 'Query #3',
    searchTerms: 'another users query',
    filters: {"textFilters":{"phonenumber":{"live":"","submitted":""}},"dateFilters":{"dateCreated":{"beginDate":null,"endDate":null}}},
    username: 'test2',
    frequency: 'weekly',
    selectedSort: {"title":"Best Match","order":"rank"},
    includeMissing: {'aggregations': {}, 'allIncludeMissing': false},
    createDate: new Date(),
    lastRunDate: new Date()
  }, function() {
      console.log('finished populating queries');
    }
  );
});

Notification.find({}).remove(function() {
  Notification.create({
    queryId: '55366684f6867d4715f4f9e9',
    username: 'test',
    hasRun: false,
    dateCreated: new Date()
  },{
    queryId: '55366684f6867d4715f4f9ea',
    username: 'test',
    hasRun: false,
    dateCreated: new Date()
  },{
    queryId: '55366684f6867d4715f4f9eb',
    username: 'test2',
    hasRun: false,
    dateCreated: new Date()
  }, function() {
      console.log('finished populating notifications');
    }
  );
});