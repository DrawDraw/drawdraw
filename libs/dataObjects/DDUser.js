var DDFacebookClient = require(__dirname + '/../clients/DDFacebookClient.js'); 
var DDError = require(__dirname + '/./DDError.js'); 
var DDUser = function (id, name, imageUrl, externalType, externalId, createTimeStamp) {//{{{
    this.id = id;//string
    this.name = name;//string
    this.imageUrl = imageUrl;//string
    this.externalType = externalType;//string
    this.externalId = externalId;//string
    this.createTimeStamp = createTimeStamp;//
    this.createTime =  function() {
       if (this.createTimeStamp) {
           var d = new Date(this.createTimeStamp);
           var n = d.toISOString();
           return n;
       }
       return null;
    }
    this.toJSON = function() {
       return {
        id: this.id,//string
        name: this.name,//string
        imageUrl: this.imageUrl,//string
        externalType: this.externalType,//string
        externalId: externalId,//string
        createTime: this.createTime()
       };
    }
    this.save = function(callback/*dderror, res(BOOL) */ ) {
        const { Client } = require('pg');
        const client = new Client({
                            connectionString: process.env.DATABASE_URL,
                            ssl: true,
                           });
        client.connect();
        const text = 'update users set name = $1, imageUrl = $2, where id = $3'
        const values = [this.name, this.imageUrl, this.id];
        client.query(text, values, (err, res) => {
            if (err) {
                callback(new DDError(DDUser.ERROR_USER_DB_FAIL, "DB WRITE USER FAIL"), null);
            } else {
                callback(err, true);
            }
            client.end();
        });
    }
}//}}}

//class methods
DDUser.createWithExternalInfo = function (token, externalType, callback /*(err, dduser)*/) 
{//{{{
	if (!token || token.length == 0) {
		callback(new DDError(DDUser.ERROR_USER_PARAMETERS_VALIDATE_FAIL, "token.length = 0"), false);
		return;
	}
	if (!externalType || externalType.length == 0) {
		callback(new DDError(DDUser.ERROR_USER_PARAMETERS_VALIDATE_FAIL, "externalType.length = 0"), false);
		return;
	}
    if (externalType == "facebook") {
        DDFacebookClient.getUserIdAndName(token, function (error, userRes) {
            if (error) {
                callback(new DDError(DDUser.ERROR_EXTERNAL_SERVICE_FAIL, error.message), null);
                return;
            }
            DDFacebookClient.getUserPicture(token, function(userPicErr, userPicJSON) {
                var userId = userRes.id;
                var userName = userRes.name;
                var userImageUrl = userPicJSON.url;
                DDUser.create(userName, userImageUrl, externalType, userId, callback);
            });
        });
    } else {
        callback(new DDError(DDUser.ERROR_USER_PARAMETERS_VALIDATE_FAIL, "externalType "+ externalType +" not support"), null);
    }

}//}}}

DDUser.create = function (name, imageUrl, externalType, externalId, callback /*(err, dduser)*/) 
{//{{{
	if (name.length == 0) {
		callback(new DDError(DDUser.ERROR_USER_PARAMETERS_VALIDATE_FAIL, "name.length = 0"), false);
		return;
	}
	if (imageUrl.length == 0) {
		callback(new DDError(DDUser.ERROR_USER_PARAMETERS_VALIDATE_FAIL, "imageUrl.length = 0"), false);
		return;
	}
	if (externalType.length == 0) {
		callback(new DDError(DDUser.ERROR_USER_PARAMETERS_VALIDATE_FAIL, "externalType.length = 0"), false);
		return;
	}
	if (externalId.length == 0) {
		callback(new DDError(DDUser.ERROR_USER_PARAMETERS_VALIDATE_FAIL, "externalId.length = 0"), false);
		return;
    }
    DDUser.queryWithExternalInfo(externalType, externalId, function(ddError, ddUser) {
        if (ddError && ddError.code == DDUser.ERROR_USER_NOT_FOUND) {
            const { Client } = require('pg');
            const client = new Client({
                                connectionString: process.env.DATABASE_URL,
                                ssl: true,
                               });
            client.connect();
            var d = new Date();
            var time = d.getTime();

            const text = 'INSERT INTO users(id, name, imageUrl, externalType, externalId, createTime) VALUES($1, $2, $3, $4, $5, $6);'
            const values = [time, name, imageUrl, externalType, externalId, time];
            client.query(text, values, (err, res) => {
                if (err) {
                    callback(new DDError(DDUser.ERROR_USER_DB_FAIL, "DB READ USER FAIL"), null);
                } else {
                    callback(null, new DDUser(time,name, imageUrl, externalType, externalId, time));
                }
                client.end();
            });
        } else if (ddUser) {
            callback(null, ddUser);
        }
    });
}//}}}

DDUser.queryWithId = function (id, callback /*(err, dduser)*/) 
{//{{{
	if (id.length == 0) {
		callback(new DDError(DDUser.ERROR_USER_PARAMETERS_VALIDATE_FAIL, "id.length = 0"), false);
		return;
	}
    const { Client } = require('pg');
    const client = new Client({
                        connectionString: process.env.DATABASE_URL,
                        ssl: true,
                       });
    client.connect();
    const text = 'select * from users where id = $1';
    const values = [id];
    client.query(text, values, (err, res) => {
        if (err) {
            callback(new DDError(DDUser.ERROR_USER_DB_FAIL, "DB READ USER FAIL"), null);
        } else {
            var userDBJSON = res.rows[0];
            if (userDBJSON) {
                callback(err, new DDUser(userDBJSON.id ,userDBJSON.name, userDBJSON.imageurl, userDBJSON.externaltype, userDBJSON.externalid, Number(userDBJSON.createtime)));
            } else {
                callback(new DDError(DDUser.ERROR_USER_NOT_FOUND, "USER NOT FOUND"), null);
            }
        }
        client.end();
    });
}//}}}

DDUser.queryWithExternalInfo = function (externalType, externalId, callback /*(err, dduser)*/) 
{//{{{
	if (externalType.length == 0) {
		callback(new DDError(DDUser.ERROR_USER_PARAMETERS_VALIDATE_FAIL, "externalType.length = 0"), false);
		return;
	}
	if (externalId.length == 0) {
		callback(new DDError(DDUser.ERROR_USER_PARAMETERS_VALIDATE_FAIL, "externalId.length = 0"), false);
		return;
	}
    const { Client } = require('pg');
    const client = new Client({
                        connectionString: process.env.DATABASE_URL,
                        ssl: true,
                       });
    client.connect();
    const text = 'select * from users where externalType = $1 and externalId = $2';
    const values = [externalType, externalId];
    client.query(text, values, (err, res) => {
        if (err) {
            callback(new DDError(DDUser.ERROR_USER_DB_FAIL, "DB READ USER FAIL"), null);
        } else {
            var userDBJSON = res.rows[0];
            if (userDBJSON) {
                callback(err, new DDUser(userDBJSON.id ,userDBJSON.name, userDBJSON.imageurl, userDBJSON.externaltype, userDBJSON.externalid, Number(userDBJSON.createtime)));
            } else {
                callback(new DDError(DDUser.ERROR_USER_NOT_FOUND, "USER NOT FOUND"), null);
            }
        }


        client.end();
    });
}//}}}

DDUser.queryWithTokenAndExternalType = function (token, externalType, callback /*(err, dduser)*/) 
{//{{{
	if (token.length == 0) {
		callback(new DDError(DDUser.ERROR_USER_PARAMETERS_VALIDATE_FAIL, "token.length = 0"), false);
		return;
	}
    if (externalType == "facebook") {
        DDFacebookClient.getUserIdAndName(token, function (error, userRes) {
            if (error) {
                callback(new DDError(DDUser.ERROR_EXTERNAL_SERVICE_FAIL, error.message), null);
                return;
            }
            DDUser.queryWithExternalInfo(externalType, userRes.id, function (ddError, ddUser) {
                if (ddError) {
                    callback(new DDError(ddError, null));
                } else {
                    callback(null, ddUser);
                }
            });
        });
    } else {
        callback(new DDError(DDUser.ERROR_USER_PARAMETERS_VALIDATE_FAIL, "externalType "+ externalType +" not support"), null);
    }
}//}}}

//error
DDUser.ERROR_USER_NOT_FOUND = "EU001";
DDUser.ERROR_USER_DB_FAIL = "EU002";
DDUser.ERROR_USER_PARAMETERS_VALIDATE_FAIL = "EU003";
DDUser.ERROR_EXTERNAL_SERVICE_FAIL = "EU004";
module.exports = DDUser;
