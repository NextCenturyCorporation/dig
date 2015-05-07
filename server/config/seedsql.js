/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./environment');
var models = require('../models');

models.sequelize.sync().then(function () {
    console.log('running seedsql.js ...')
    // if test user exists, cascade delete it
    models.User.destroy({
        where: {username: 'test'}
    })
    .catch(function(error) {
        console.log(error);
    });
})


// exports.index = function (req, res) {
//     models.User.findAll(
//     //{
//     //     include: [ models.Query ]
//     // }
//     ).then(function(users) {
//         res.json(200, users);
//     });
// };

// exports.show = function (req, res) {

//     models.User.find({
//         where: {username: req.params.username}
//     }).then(function(user){
//         res.json(200, user);
//     });
// }

// exports.create = function (req, res) {
//     models.User.create(req.body)
//     .then(function(newuser) {
//         res.json(201, newuser);
//     }).catch(function(error) {
//         res.json(404, error);
//     });
// }

// exports.update = function (req, res) {
//     models.User.update(
//         req.body,
//         {where: {username: req.params.username}}
//     ).then(function(user) {
//         res.status(204).end();
//     }).catch(function(error) {
//         res.json(404, error);
//     });
// }

// exports.delete = function (req, res) {
//     models.User.destroy({
//         where: {username: req.params.username}
//     })
//     .then(function(user) {
//         if (user) {
//             res.status(204).end();
//         }
//         else {
//             res.status(404).end();
//         }
//     })
//     .catch(function(error) {
//         res.json(404, error);
//     });
// }

// exports.me = function(req, res, next) {
//     models.User.findOrCreate({
//         where: {username: req.headers.user}
//     }).spread(function(user, created) {
//         console.log(created);
//         res.json(200, user);
//     }).catch(function(error) {
//         res.json(400, error);
//     });
// };



// User.find({}).remove(function() {
//   User.create({
//     provider: 'local',
//     role: 'user',
//     name: 'Test User',
//     username: 'test'
//   }, function() {
//       console.log('finished populating users');
//     }
//   );
// });

// Query.find({}).remove(function() {
//   Query.create({
//     name: 'Query #1',
//     digState: {
//       searchTerms: 'bob smith',
//       filters: {"aggFilters":{"city_agg":{"LittleRock":true,"FortSmith":true}},"textFilters":{"phonenumber":{"live":"","submitted":""}},"dateFilters":{"dateCreated":{"beginDate":null,"endDate":null}}},
//       selectedSort: {"title":"Best Match","order":"rank"},
//       includeMissing: {'aggregations': {}, 'allIncludeMissing': false}
//     },
//     elasticUIState: {
//       queryState:{"query_string":{"fields":["_all"],"query":"bob smith"}}},
//       filterState:{"bool":{"should":[{"terms":{"hasFeatureCollection\\uff0eplace_postalAddress_feature\\uff0efeatureObject\\uff0eaddressLocality":["LittleRock"]}},{"terms":{"hasFeatureCollection\\uff0eplace_postalAddress_feature\\uff0efeatureObject\\uff0eaddressLocality":["FortSmith"]}}]}
//     },
//     username: 'test',
//     frequency: 'never',
//     createDate: new Date(),
//     lastRunDate: new Date(),
//     hasNotification: true
//   }, {
//     name: 'Query #2',
//     digState: {
//       searchTerms: 'jane doe',
//       filters: {"textFilters":{"phonenumber":{"live":"","submitted":""}},"dateFilters":{"dateCreated":{"beginDate":"2013-02-02T05:00:00.000Z","endDate":"2015-02-03T05:00:00.000Z"}}},
//       selectedSort: {"title":"Best Match","order":"rank"},
//       includeMissing: {'aggregations': {}, 'allIncludeMissing': false}
//     },
//     elasticUIState: {
//       queryState: {"query_string":{"query":"jane doe","fields":["_all"]}},
//       filterState:{"bool":{"must":[{"range":{"dateCreated":{"from":"2013-02-02"}}},{"range":{"dateCreated":{"to":"2015-02-03"}}}]}}
//     },
//     username: 'test',
//     frequency: 'never',
//     createDate: new Date(),
//     lastRunDate: new Date()
//   }, {
//     name: 'Query #3',
//     digState: {
//       searchTerms: 'another users query',
//       filters: {"textFilters":{"phonenumber":{"live":"","submitted":""}},"dateFilters":{"dateCreated":{"beginDate":null,"endDate":null}}},
//       selectedSort: {"title":"Best Match","order":"rank"},
//       includeMissing: {'aggregations': {}, 'allIncludeMissing': false}
//     },
//     elasticUIState: {
//       queryState: {"query_string":{"fields":["_all"],"query":"another users query"}}
//     },
//     username: 'test2',
//     frequency: 'never',
//     createDate: new Date(),
//     lastRunDate: new Date()
//   }, function() {
//       console.log('finished populating queries');
//     }
//   );
// });
