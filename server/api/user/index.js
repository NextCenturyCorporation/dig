'use strict';

var express = require('express');
var userController = require('./user.controller'),
    folderController = require('./folder.controller');

var router = express.Router();

/*
 * user routes
 * 
 * /reqHeader is special id that means to look in req.headers for user name
 */
router.get('/', userController.index);
router.post('/', userController.create);
router.get('/:username', userController.show);
router.put('/:username', userController.update);
router.delete('/:username', userController.delete);
router.get('/:username/notifications/count', userController.notificationCount);

/*
 * folder routes
 */
router.get('/:username/folders', folderController.index);
router.get('/:username/folders/:folderid', folderController.show);
router.post('/:username/folders', folderController.create);
router.put('/:username/folders/:folderid', folderController.update);
//router.put('/:username/folders/removeItems/:id', folderController.removeItems);
router.delete('/:id', folderController.destroy);

module.exports = router;