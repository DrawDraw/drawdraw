var imageUploader = require('./libs/imageUploader.js');
imageUploader.uploadImage("./test.jpg", function (err, result) { console.log(err); console.log(result)});
console.log(__dirname);
