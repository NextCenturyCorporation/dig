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
    models.User.create(req.body)
    .then(function(newuser) {
        res.json(201, newuser);
    }).catch(function(error) {
        res.json(404, error);
    });
}

exports.update = function (req, res) {
    models.User.update(
        req.body,
        {where: {username: req.params.username}}
    ).then(function(user) {
        res.status(204).end();
    }).catch(function(error) {
        res.json(404, error);
    });
}

exports.delete = function (req, res) {
    models.User.destroy({
        where: {username: req.params.username}
    })
    .then(function(user) {
        if (user) {
            res.status(204).end();
        }
        else {
            res.status(404).end();
        }
    })
    .catch(function(error) {
        res.json(404, error);
    });
}

exports.me = function(req, res) {
    models.User.findOrCreate({
        where: {username: req.headers.user}
    }).spread(function(user, created) {
        console.log(created);
        res.json(200, user);
    }).catch(function(error) {
        res.json(400, error);
    });
};

exports.notificationCount = function (req, res) {
    res.json(200, {notRunCount: 2, hasRunCount: 9});
}