var imageUploader = require('../libs/DDImageUploader.js');
imageUploader.uploadImage("./test.jpg", function (err, result) { console.log(err); console.log(result)});
console.log(__dirname);
