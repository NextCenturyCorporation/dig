'use strict';

var models = require('../../models');

exports.index = function (req, res) {
    res.json(200, []);
};

exports.count = function (req, res) {
    res.json(200, 5);
}

exports.show = function (req, res) {
    res.json(200, {});
};

exports.create = function (req, res) {
    res.json(201, {});
};

exports.update = function (req, res) {
    res.json(204);
};

exports.delete = function (req, res) {
    res.json(204);
};