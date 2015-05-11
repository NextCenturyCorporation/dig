'use strict';

var express = require('express');
var userController = require('./user.controller');

var router = express.Router();

/*
 * user routes
 * 
 * /me is special id that means to look in req.headers for user name
 */
router.get('/', userController.index);
router.post('/', userController.create);
router.get('/:username', userController.show);
// TODO: check that user has admin privs to update and delete
router.put('/:username', userController.update);
router.delete('/:username', userController.delete);
router.get('/:username/notifications/count', userController.notificationCount);



module.exports = router;