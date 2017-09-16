var express = require('express');
var formidable = require('formidable')
var util = require('util');
var router = express.Router();
var imageUploader = require(__dirname + '/../../libs/imageUploader.js');

/* GET home page. */
router.post('/', function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
	    imageUploader.uploadImage(files.file.path, function (err, result) { 
            var fs = require('fs');
            fs.unlink(files.file.path,function(err){
            });
	   	    var returnJson = {"imageUrl": result};
	   	    res.status(200).json(returnJson);
        });
    })

});

module.exports = router;
