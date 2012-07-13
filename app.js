var request = require('request');
var url = require('url');
var redis = require('redis');
var express = require('express');

var redisClient = redis.createClient();
var app = express.createServer();
app.set('view engine', 'ejs');
app.use(express.bodyParser());


app.get('/api/wines', function(req, response) {
	rwines = redisClient.lrange('wines',0,-1,function(err, wines){
		wines = wines.map(JSON.parse);
		response.render('wines.ejs', {wines: wines});
	});
});

app.get('/api/wines/:wine', function(req, response) {
	var id = req.params.wine;
	wine = redisClient.lindex('wines', id, function(err, wine){
		console.log(wine);
		response.render('wine.ejs', {id: id, wine: JSON.parse(wine)});
	});
});

app.post('/api/wines', function(req, response) {
	wine = req.body;
	console.log(wine);
  	redisClient.rpush('wines', JSON.stringify(wine), function(err, wine){
  		redisClient.llen('wines', function(err, length){
  			id = length-1;
  			response.render('wine.ejs', {id: 1, wine: wine});
  		});
	});
});

app.put('/api/wines/:wine', function(req, response) {
	var id = req.params.wine;
	wine = req.body;
	console.log(wine);
	redisClient.lset('wines', id, JSON.stringify(wine), function(err){
		response.render('wine.ejs', {id: id, wine: wine});
	});
});

app.listen(8080);

