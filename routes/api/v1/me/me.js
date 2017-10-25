var express = require('express');
var router = express.Router();
var service = require(__dirname + '/../../../../libs/DDService.js');

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log( req.query.type);
    console.log( req.query.token);
    service.getUser(req.query.token, req.query.type, function(dderror, dduser) {
       if (dderror) {
           res.setHeader('Content-Type', 'application/json');
           res.status(400).json(dderror);
       } else {
           res.setHeader('Content-Type', 'application/json');
           res.status(200).json(dduser);
       }
    });
});

module.exports = router;
