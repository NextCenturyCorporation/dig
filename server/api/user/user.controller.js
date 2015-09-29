'use strict';

var models = require('../../models');
var sequelize = models.sequelize;

var setUserName = function (req) {
    if (req.params.username === 'reqHeader') {
        req.params.username = req.headers.user;
    }    
}

exports.index = function (req, res) {
    models.User.findAll().then(function(users) {
        res.status(200).json(users);
    })
    .catch(function(error) {
        res.status(400).json(error);
    });
};

exports.show = function (req, res) {
    setUserName(req);
    models.User.findOrCreate({
        where: {username: req.params.username}
    }).spread(function(user, created) {
        res.status(200).json(user);
    }).catch(function(error) {
        res.status(400).json(error);
    });
}

exports.create = function (req, res) {
    models.User.create(req.body)
    .then(function(newuser) {
        res.status(201).json(newuser);
    }).catch(function(error) {
        res.status(404).json(error);
    });
}

exports.update = function (req, res) {
    setUserName(req);
    models.User.update(
        req.body,
        {where: {username: req.params.username}}
    ).then(function(user) {
        res.status(204).end();
    }).catch(function(error) {
        res.status(403).json(error);
    });
}

exports.delete = function (req, res) {
    setUserName(req);
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
        res.status(404).json(error);
    });
}

// return active (hasrun=false) notifications for specified user
exports.notificationCount = function (req, res) {
    setUserName(req);
    sequelize.query(
        "select count(*) as notrun from Users inner join Queries on " +
        "Users.username = Queries.UserUsername where " +
        "Queries.notificationHasRun=(0) and Users.username = :username",
        { replacements: { username: req.params.username }, 
        type: sequelize.QueryTypes.SELECT })
    .then(function(results) {
        var count = results[0].notrun;
        res.status(200).json({notRunCount: count});
    }).catch(function(error) {
        res.status(400).json(error);
    });    
}

