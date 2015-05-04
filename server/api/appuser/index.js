'use strict';

var express = require('express');
var controller = require('./appuser.controller');

var router = express.Router();

/*
 * user routes
 * 
 * /me is special id that means to look in req.headers for user name
 */
router.get('/', controller.index);
router.post('/', controller.create);
router.get('/me', controller.me);
router.get('/:username', controller.show);

/*
 * query routes
 *
 *
 */

module.exports = router;