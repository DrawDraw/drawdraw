var imageUploader = {};
imageUploader.uploadImage = function (imagePath, callback) {
    var Flickr = require("flickrapi");
    var apiKey = process.env.FLICKR_API_KEY; 
    var secret = process.env.FLICKR_SECRET;
    var userId = process.env.FLICKR_USER_ID;
    var accessToken = process.env.FLICKR_ACCESS_TOKEN;
    var accessTokenSecret = process.env.FLICKR_ACCESS_TOKEN_SECRET;
    FlickrOptions = {
      api_key: apiKey,
      secret: secret,
      permissions: "delete",
      nobrowser: true,
      progress: true,
      user_id: userId,
      access_token: accessToken,
      access_token_secret: accessTokenSecret
    };
    
    Flickr.authenticate(FlickrOptions, function(error, flickr) {
      var uploadOptions = {
        photos: [{
          title: "test",
          tags: [],
          photo: imagePath
        }]
      };
    
      Flickr.upload(uploadOptions, FlickrOptions, function(err, result) {
        if(err) {
          return console.error(error);
        }
        for (var i in result) {
          var photoId = result[i];
          //static object
          flickr.photos.getInfo({photo_id: photoId, api_key: apiKey},  function(err, result) {
            if (!err) {
              var imageUrlfarmId = result.photo.farm;
              var imageUrlServerId = result.photo.server;
              var imageUrlPhotoId = result.photo.id;
              var imageUrlSecretId = result.photo.secret;
              var originalFormat = result.photo.originalformat;
              var imageUrl = "https://farm"+ imageUrlfarmId+".staticflickr.com/"+imageUrlServerId+"/"+imageUrlPhotoId+"_"+imageUrlSecretId+"."+originalFormat;
              callback(null, imageUrl);
            } else {
              callback(err, null);
            }
          });
        }
        return;
      });
    });
}
module.exports = imageUploader;

