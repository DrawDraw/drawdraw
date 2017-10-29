var DDUser = require(__dirname + "/dataObjects/DDUser.js")
var DDService = {};

DDService.getUserWithExternalType = function (token, externalType/*facebook*/, callback/* function(dderror, dduser) */) {
    DDUser.queryWithTokenAndExternalType(token, externalType, function(ddError, ddUser) {
        var errorJSON;
        var userJSON;
        if (ddError) {
            errorJSON = ddError.toJSON();
        } 
        if (ddUser) {

            userJSON = ddUser.toJSON();
        } 
        callback(errorJSON, userJSON);
    });
};

DDService.getUserWithId = function (id, callback/* function(dderror, dduser) */) {
    DDUser.queryWithId(id, function(ddError, ddUser) {
        var errorJSON;
        var userJSON;
        if (ddError) {
            errorJSON = ddError.toJSON();
        } 
        if (ddUser) {

            userJSON = ddUser.toJSON();
        } 
        callback(errorJSON, userJSON);
    });
};

module.exports = DDService;
