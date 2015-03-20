'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');

var router = express.Router();

router.get('/', controller.index);
router.get('/me', controller.me);
router.get('/:id', controller.show);

module.exports = router;
