var DDUser = function (id, name, imageUrl, externalType, externalId, createTimeStamp) {
    this.id = id;//string
    this.name = name;//string
    this.imageUrl = imageUrl;//string
    this.externalType = externalType;//string
    this.externalId = externalId;//string
    this.createTimeStamp = createTimeStamp;//
    this.createTime =  function() {
    console.log(typeof(this.createTimeStamp));
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
                callback(DDError.create(DDError.ERRORCODE_SYSTEM, "DB WRITE USER FAIL"), null);
            } else {
                callback(err, true);
            }
            client.end();
        });
    }
}

//class methods
DDUser.create = function (name, imageUrl, externalType, externalId, callback /*(err, dduser)*/) 
{//{{{
	if (name.length == 0) {
		callback(DDError.create(DDError.ERRORCODE_VALIDATE, "name.length = 0"), false);
		return;
	}
	if (imageUrl.length == 0) {
		callback(DDError.create(DDError.ERRORCODE_VALIDATE, "imageUrl.length = 0"), false);
		return;
	}
	if (externalType.length == 0) {
		callback(DDError.create(DDError.ERRORCODE_VALIDATE, "externalType.length = 0"), false);
		return;
	}
	if (externalId.length == 0) {
		callback(DDError.create(DDError.ERRORCODE_VALIDATE, "externalId.length = 0"), false);
		return;
    }
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
            console.log(err);
            callback(DDError.create(DDError.ERRORCODE_SYSTEM, "DB WRITE USER FAIL"), null);
        } else {
            callback(err, new DDUser(time,name, imageUrl, externalType, externalId, time));
        }
        client.end();
    });
}//}}}

DDUser.queryById = function (id, callback /*(err, dduser)*/) 
{//{{{
	if (id.length == 0) {
		callback(DDError.create(DDError.ERRORCODE_VALIDATE, "id.length = 0"), false);
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
            console.log(err);
            callback(DDError.create(DDError.ERRORCODE_SYSTEM, "DB WRITE USER FAIL"), null);
        } else {
        var userDBJSON = res.rows[0];
            callback(err, new DDUser(userDBJSON.id ,userDBJSON.name, userDBJSON.imageurl, userDBJSON.externaltype, userDBJSON.externalid, Number(userDBJSON.createtime)));
        }
        client.end();
    });
}//}}}

DDUser.queryByExternalTypeAndExternalId = function (externalType, externalId, callback /*(err, dduser)*/) 
{//{{{
	if (externalType.length == 0) {
		callback(DDError.create(DDError.ERRORCODE_VALIDATE, "externalType.length = 0"), false);
		return;
	}
	if (externalId.length == 0) {
		callback(DDError.create(DDError.ERRORCODE_VALIDATE, "externalId.length = 0"), false);
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
            console.log(err);
            callback(DDError.create(DDError.ERRORCODE_SYSTEM, "DB WRITE USER FAIL"), null);
        } else {
        var userDBJSON = res.rows[0];
            callback(err, new DDUser(userDBJSON.id ,userDBJSON.name, userDBJSON.imageurl, userDBJSON.externaltype, userDBJSON.externalid, Number(userDBJSON.createtime)));
        }
        client.end();
    });
}//}}}





module.exports = DDUser;
