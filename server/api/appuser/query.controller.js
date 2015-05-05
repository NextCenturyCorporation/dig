/**
* Using standard naming convention for endpoints.
* GET     /things              ->  index
* POST    /things              ->  create
* GET     /things/:id          ->  show
* PUT     /things/:id          ->  update
* DELETE  /things/:id          ->  destroy
*/

'use strict';

var models = require('../../models');

var deserialize = function (query) {
    var desQuery = {};
    desQuery.name = query.name;
    desQuery.frequency = query.frequency;
    desQuery.digState = JSON.parse(query.digState);
    desQuery.elasticUIState = JSON.parse(query.elasticUIState);
    return desQuery;
}

exports.index = function (req, res) {
    if (req.params.username === 'me') {
        req.params.username = req.headers.user;
    }

    models.Query.findAll(
        {where: {userusername: req.params.username}}
    ).then(function(queries) {
        var desQueries = [];
        queries.forEach(function(query) {
            desQueries.push(deserialize(query));
        });
        res.json(200, desQueries);
    }).catch(function(error) {
        res.json(400, error);
    });
}

exports.show = function (req, res) {
    models.Queries.find({
        where: {id: req.params.queryid}
    }).then(function(query){
        res.json(200, deserialize(query));
    }).catch(function(error) {
        res.json(404, error);
    });
}

exports.create = function (req, res) {
    if (req.params.username === 'me') {
        req.params.username = req.headers.user;
    }
    models.User.find({
        username: req.params.username
    }).then(function(user) {
        models.Query.create({
            name: req.params.name,
            elasticUIState: JSON.stringify(req.params.elasticUIState),
            digState: JSON.stringify(req.params.digState),
            frequency: frequency
        }).then(function(query) {
            query.setUser(user).then(function() {
                res.json(201, query);
            });
        });
    }).catch(function (error) {
        res.json(404, error);
    });
}

// exports.update = function (req, res) {
//     modes.User.update(
//         {role: req.query.role},
//         {where: {username: req.param('username')}}
//     ).then(function(user) {
//             res.json(204);
//     }).catch(function(error) {
//         res.json(404, error);
//     });
// }

// exports.delete = function (req, res) {
//     models.User.destroy({
//         where: {username: req.param('username')}
//     }).then(function(user) {
//         res.json(204);
//     }).catch(function(error) {
//         res.json(404, error);
//     });
// }