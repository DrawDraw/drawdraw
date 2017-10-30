var express = require('express');
var router = express.Router();
var jsonBody = require("body/json")
var service = require(__dirname + '/../../../../libs/DDService.js');

/* GET home page. */
router.get('/me', function(req, res, next) {
    service.getUserWithExternalType(req.query.token, req.query.type, function(ddErrorJSON, ddUserJSON) {
        if (ddErrorJSON) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json(ddErrorJSON);
        } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(ddUserJSON);
        }
    });
});

router.get('/:userId', function(req, res, next) {
    service.getUserWithId(req.params.userId,  function(ddErrorJSON, ddUserJSON) {
        if (ddErrorJSON) {
           res.setHeader('Content-Type', 'application/json');
           res.status(400).json(ddErrorJSON);
           return;
        }
        if (ddUserJSON.id !== req.params.userId) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json(ddErrorJSON);
        } else {
            if (ddErrorJSON) {
                res.setHeader('Content-Type', 'application/json');
                res.status(400).json(ddErrorJSON);
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(ddUserJSON);
            }
        }
    });
});

module.exports = router;
