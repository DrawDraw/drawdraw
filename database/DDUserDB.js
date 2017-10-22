var DDError = require(__dirname + '/../models/DDError.js');
var DDUserDB = {};

//id varchar(50),
//name varchar(500),
//imageUrl varchar(500),
//externalType varchar(10),
//externalId varchar(200),
//createTime varchar(20)
DDUserDB.create = function (name, imageUrl, externalType, externalId, callback /*(err, res)*/) {
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
            callback(err, true);
        }
        client.end();
    });
}
/// test
/// DDUserDB.create(
///   "user1", 
///   "https://scontent-tpe1-1.xx.fbcdn.net/v/t1.0-9/20264938_10213552030293640_4894514888964556529_n.jpg?oh=82f79fba565168009d62545ca5437985&oe=5A708DE2", 
///   "fb", 
///   "ngchiwa.1105", 
///   function (err, res) {
///   console.log(err);
///   console.log(res);
///   }
/// );

DDUserDB.queryWithId = function (id, callback /*(err, res)*/) {
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
    client.query('SELECT * from users where id = $1;',[id],  (err, res) => {
      if (err) {
          callback(DDError.create(DDError.ERRORCODE_SYSTEM, "DB READ USER FAIL"), null);
      }
      if (res.rows[0] !== undefined) {
          callback(null, res.rows[0]);
      } else {
          callback(null, null);
      }
      client.end();
    });
}
/// test
/// DDUserDB.queryWithId("1508664895022",
/// function (err, res) {
/// console.log(res.id);
/// });

module.exports = DDUserDB;
