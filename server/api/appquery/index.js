'use strict';

var express = require('express');
var queryController = require('./query.controller');

var router = express.Router();

/*
 * query routes
 *
 * e.g. GET http://host/api/appusers/eugene/queries -- list all
 *      queries for user eugene
 */

router.get('/users/:username/queries', queryController.index);
router.post('/users/:username/queries', queryController.create);
router.get('/queries/:queryid', queryController.show);
router.put('/queries/:queryid', queryController.update);
router.delete('/queries/:queryid', queryController.delete);


module.exports = router;