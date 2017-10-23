var imageUploader = require(__dirname + '/../libs/DDImageUploader.js');
imageUploader.uploadImage(__dirname + "/test.jpg", function (err, result) { console.log(err); console.log(result)});
console.log(__dirname);
