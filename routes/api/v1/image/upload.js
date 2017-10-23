var express = require('express');
var formidable = require('formidable')
var util = require('util');
var router = express.Router();
var imageUploader = require(__dirname + '/../../../../libs/DDImageUploader.js');

/* GET home page. */
router.post('/', function(req, res, next) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        var imagePath = files.image.path;
	    imageUploader.uploadImage(imagePath, function (err, result) { 
            var fs = require('fs');
            fs.unlink(imagePath,function(err){
                var returnJson = {"url": result};
	   	        res.status(200).json(returnJson);
            });
	   	});
    })

});

module.exports = router;
