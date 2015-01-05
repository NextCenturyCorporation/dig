var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	console.log('before sleep');
	setTimeout(function () {
		res.send({'some' : 'json'});
		console.log('after 5s timeout');
	}, 5000);	
});

module.exports = router;
