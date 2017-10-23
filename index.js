var express = require('express');
var app = express();
var upload = require(__dirname + '/routes/api/v1/image/upload'); //image upload
app.use('/api/v1/images', upload);
app.use('/web/login', upload);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


