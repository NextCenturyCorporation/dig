/**
* Using Rails-like standard naming convention for endpoints.
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
        where: {username: req.param('username')}
    }).then(function(user){
        res.json(200, user);
    });
}

exports.create = function (req, res) {
    models.User.create({
        username: req.param('username')
    }).then(function(newuser) {
        res.json(201, newuser);
    }).catch(function(error) {
        res.json(404, error);
    });
}

/**
* Legacy function from yeoman fullstack generated passport authentication
* architecture.
* TODO: re-design this functionality when SSO solution is achieved.
*/
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