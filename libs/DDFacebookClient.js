var DDFacebookClient = {};

/*
return
{
  "name": "Ngchiwa Ng",
  "id": "10214188198917458"
}
*/
DDFacebookClient.getUserIdAndName = function (token, callback/* function(error, {id, name}) */) {
    var request = require('request');
    request('https://graph.facebook.com/v2.10/me?fields=id,name&access_token='+ token, 
            function (error, response, body) {
                console.log('error:', error); // Print the error if one occurred
                if (error) {
                    callback(error, null);
                } else if (response && response.statusCode && (response.statusCode >= 200 && response.statusCode < 400)) {
                    callback(null, body);
                } else {
                    callback(new Error("get data fail"), null);
                }
            }
    );
}

/*
return:
   { height: 320,
     is_silhouette: false,
     url: 'https://scontent.xx.fbcdn.net/v/t1.0-1/p320x320/20264938_10213552030293640_4894514888964556529_n.jpg?oh=a1b3168dbdeba52658a8e18e9b21690e&oe=5A772089',
     width: 320 }
*/
DDFacebookClient.getUserPicture = function (token, callback/* function(error, res) */) {
    var request = require('request');
    request('https://graph.facebook.com/v2.10/10214188198917458/picture?access_token=' + token + "&redirect=false&height=300", 
             function (error, response, pictureBody) {
                 console.log('error:', error); // Print the error if one occurred
                 if (error) {
                     callback(error, null);
                 } else if (response && response.statusCode && (response.statusCode >= 200 && response.statusCode < 400)) {
                     var pictureJSON = JSON.parse(pictureBody);
                     callback(null, pictureJSON.data);
                 } else {
                     callback(new Error("get data fail"), null);
                 }
             }
     );
}

module.exports = DDFacebookClient;
