var express = require('express');
var router = express.Router();
var service = require(__dirname + '/../../../../libs/DDService.js');

/* GET home page. */
router.get('/me', function(req, res, next) {
    service.getUserWithExternalType(req.query.token, req.query.type, function(ddError, ddUser) {
       if (ddError) {
           res.setHeader('Content-Type', 'application/json');
           res.status(400).json(ddError);
       } else {
           res.setHeader('Content-Type', 'application/json');
           res.status(200).json(ddUser);
       }
    });
});

router.get('/:userId', function(req, res, next) {
service.getUserWithId(req.params.userId,  function(ddError, ddUser) {
        if (ddError) {
           res.setHeader('Content-Type', 'application/json');
           res.status(400).json(ddError);
           return;
        }
        if (ddUser.id !== req.params.userId) {
            res.setHeader('Content-Type', 'application/json');
            res.status(400).json(ddError.create(ddError.ERRORCODE_VALIDATE, "user not belong this userId"));
        } else {
            if (ddError) {
                res.setHeader('Content-Type', 'application/json');
                res.status(400).json(ddError);
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json(ddUser);
            }
        }
    });
});

module.exports = router;
