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

exports.index = function (req, res) {
    models.User.findAll(
    //{
    //     include: [ models.Query ]
    // }
    ).then(function(users) {
        res.json(200, users);
    });
};

exports.show = function (req, res) {

    models.User.find({
        where: {username: req.params.username}
    }).then(function(user){
        res.json(200, user);
    });
}

exports.create = function (req, res) {
    models.User.create({
        username: req.params.username
    }).then(function(newuser) {
        res.json(201, newuser);
    }).catch(function(error) {
        res.json(404, error);
    });
}

exports.update = function (req, res) {
    modes.User.update(
        {role: req.query.role},
        {where: {username: req.params.username}}
    ).then(function(user) {
            res.json(204);
    }).catch(function(error) {
        res.json(404, error);
    });
}

exports.delete = function (req, res) {
    models.User.destroy({
        where: {username: req.params.username}
    }).then(function(user) {
        res.json(204);
    }).catch(function(error) {
        res.json(404, error);
    });
}

exports.me = function(req, res, next) {
    models.User.findOrCreate({
        where: {username: req.headers.user}
    }).spread(function(user, created) {
        console.log(created);
        res.json(200, user);
    }).catch(function(error) {
        res.json(400, error);
    });
};