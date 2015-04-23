'use strict';

var express = require('express');
var controller = require('./query.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.updatePut);
router.patch('/:id', controller.updatePatch);
router.delete('/:id', controller.destroy);

module.exports = router;