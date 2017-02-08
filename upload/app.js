var express = require('express');
var app = express();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var cors = require('cors')

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/upload', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;
  
  form.hash = 'md5'

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  var fileName = ''
  form.on('file', function(field, file) {
    var ext = file.name.slice(file.name.lastIndexOf('.'))
    fileName = file.hash + ext
    fs.rename(file.path, path.join(form.uploadDir, fileName));
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.send({
      url: 'http://localhost:3030/' + fileName
    });
  });

  // parse the incoming request containing the form data
  form.parse(req);

});

var server = app.listen(3030, function(){
  console.log('Server listening on port 3030');
});
