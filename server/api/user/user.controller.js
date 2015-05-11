'use strict';

var models = require('../../models');
var sequelize = models.sequelize;

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

// get the user using the username in http header
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

/**
 * Update my info
 */
exports.updateMe = function(req, res, next) {
    exports.update(req, res, next);
};

// return active (hasrun=false) notifications for specified user
exports.notificationCount = function (req, res) {
    if (req.params.username === 'reqHeader') {
        req.params.username = req.headers.user;
    }
    sequelize.query(
        "select count(*) as notrun from users inner join queries on " +
        "users.username = queries.userusername where " +
        "queries.notificationhasrun=(0) and users.username = :username",
        { replacements: { username: req.params.username }, 
        type: sequelize.QueryTypes.SELECT })
    .then(function(results) {
        console.log(results);
        var count = results[0].notrun;
        res.json(200, {notRunCount: count});
    }).catch(function(error) {
        res.json(400, error);
    });    
}