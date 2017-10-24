var express = require('express');
var formidable = require('formidable')
var util = require('util');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('pages/login');
});

module.exports = router;
