'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');

var router = express.Router();

router.get('/me', controller.me);
router.put('/me', controller.updateMe);

module.exports = router;
