'use strict';

var express = require('express');
var controller = require('./folder.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.put('/removeItems/:id', controller.removeItems);
router.delete('/:id', controller.destroy);

module.exports = router;