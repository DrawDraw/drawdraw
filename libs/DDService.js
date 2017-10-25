var DDFacebookClient = require(__dirname + '/./clients/DDFacebookClient.js'); 
var DDUser = require(__dirname + '/../models/DDUser.js'); 
var DDError = require(__dirname + '/../models/DDError.js'); 
var DDService = {};

DDService.getUser = function (token, type/*facebook*/, callback/* function(dderror, dduser) */) {
    if (!token || token.length == 0) {
        callback(DDError.create(DDError.ERRORCODE_VALIDATE, "token validate fail"), null);
        return;
    }
    if (!type || type.length == 0) {
        callback(DDError.create(DDError.ERRORCODE_VALIDATE, "type validate fail"), null);
        return;
    }

    if (type === "facebook") {
        DDFacebookClient.getUserIdAndName(token, function (error, userRes) {
            if (error) {
                callback(DDError.create(DDError.ERRORCODE_SYSTEM, error.message), null);
                return;
            }
            DDFacebookClient.getUserPicture(token, function (error, imageRes) {
                if (error) {
                    callback(DDError.create(DDError.ERRORCODE_SYSTEM, error.message), null);
                    return;
                } else {
                    callback(null, DDUser.create(userRes.id, userRes.name, imageRes.url));
                }
            });
        });
    } else {
        callback(DDError.create(DDError.ERRORCODE_VALIDATE, "type "+type+" not support"), null);
        return;
    }
};
