// Setup basic express server
var favicon = require('serve-favicon');
var request = require("request");
var url = require('url');
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var port = process.env.PORT || 3000;
var fs = require('fs');
var username = 'Test';
var password = '123';
var auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');

request({
    url: "https://jsonplaceholder.typicode.com/users",
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        users = body; // Print the json response
    }
})

request({
    url: "https://jsonplaceholder.typicode.com/albums",
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        albums = body; // Print the json response
    }
})

request({
    url: "https://jsonplaceholder.typicode.com/photos",
    json: true
}, function (error, response, body) {

    if (!error && response.statusCode === 200) {
        photos = body; // Print the json response
    }
})

var isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
}

function parseURL(request, response) {
	var parseQuery = true //parseQueryStringIfTrue
	var slashHost = true //slashDenoteHostIfTrue
	var urlObj = url.parse(request.url, parseQuery, slashHost)
	console.log('path:')
	console.log(urlObj.path)
	console.log('query:')
	console.log(urlObj.query)
	//for(x in urlObj.query) console.log(x + ': ' + urlObj.query[x]);
	return urlObj
}
// Make your Express server:
app.use(express.static(path.join(__dirname, 'public')));

// Add favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');


app.get('/api/ping', (req, res) => {
	res.header("Content-Type",'application/json');
	res.json({"success":"true"});
	res.status(200);
});

app.get('/api/users', (req, res) => {
	res.header("Content-Type",'application/json');
	res.json(users);
	res.status(200);
});

app.get('/api/user/search/photos', (req, res) => {
	res.header("Content-Type",'application/json');
	var urlObj = parseURL(req, res);
	var userAlbums = albums.filter(function(v){
    	return v.userId === parseInt(urlObj.query.userId);
	})

	var result = userAlbums.map(x => Object.assign(x, photos.find(y => y.albumId == x.id)));
	res.json(result);
	res.status(200);
});



app.get('/api/user/search/albums', (req, res) => {
	res.header("Content-Type",'application/json');
	var urlObj = parseURL(req, res);
	var result = albums.filter(function(v){
    	return v.userId === parseInt(urlObj.query.userId);
	})
	if (urlObj.path === '/api/user/search/albums'){
		res.json(albums);
	}
	else{
		res.json(result);
	}
	res.status(200);
});

app.get('/api/search/albums', (req, res) => {
	res.header("Content-Type",'application/json');
	var urlObj = parseURL(req, res);
	var result = albums.find(function(x){ return x.id === parseInt(urlObj.query.id)});
	res.json(result);
	res.status(200);
});

app.get('/api/search/photos', (req, res) => {
	res.header("Content-Type",'application/json');
	var urlObj = parseURL(req, res);
	var result = photos.find(function(x){ return x.id === parseInt(urlObj.query.id)});
	res.json(result);
	res.status(200);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {

    app.locals.pretty = true;  // made Jade HTML pretty
  
    app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
	    message: err.message,
	    error: err
	});
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

server.listen(port, () => {
	console.log('Server listening at port %d\n', port);
	console.log('Testing:');
	console.log('http://localhost:3000/api/ping');
	console.log('http://localhost:3000/api/users');
	console.log('http://localhost:3000/api/user/search/photos?userId=2');
	console.log('http://localhost:3000/api/user/search/albums?userId=2');
	console.log('http://localhost:3000/api/search/albums?id=2');
	console.log('http://localhost:3000/api/search/photos?id=2');
});

