'use strict';

var express = require('express');
var userController = require('./user.controller');
var queryController = require('./query.controller');

var router = express.Router();

/*
 * user routes
 * 
 * /me is special id that means to look in req.headers for user name
 */
router.get('/', userController.index);
router.post('/', userController.create);
router.get('/me', userController.me);
router.get('/:username', userController.show);
// TODO: check that user has admin privs to update and delete
router.put('/:username', userController.update);
router.delete('/:username', userController.delete);
router.get('/:username/notifications/count', userController.notificationCount);

/*
 * query routes
 *
 * e.g. GET http://host/api/appusers/eugene/queries -- list all
 *      queries for user eugene
 */

router.get('/:username/queries', queryController.index);
router.post('/:username/queries', queryController.create);
router.get('/queries/:queryid', queryController.show);
router.put('/queries/:queryid', queryController.update);
router.delete('/queries/:queryid', queryController.delete);


module.exports = router;