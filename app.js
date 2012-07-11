var request = require('request');
var url = require('url');
var redis = require('redis');
var express = require('express');

var redisClient = redis.createClient();
var app = express.createServer();
app.set('view engine', 'ejs');
app.use(express.bodyParser());


var wines = [{"name": "Midland Vinyards Red",
							"grapes": "red",
							"country": "Ruritania",
							"region": "Midland slopes",
							"year": "1834",
							"description": "very smooth"}];


// There must be a better way to do this than stringifying and parsingthe entire JSON object!!!
app.get('/api/wines', function(req, response) {
	rwines = redisClient.lrange('wines',0,-1,function(err, wines){
		//wines = JSON.parse(wines);
		console.log("Type: "+typeof(wines[0]));
		console.log(wines[0].name);
		response.render('wines.ejs', {wines: wines});
	});
});

app.get('/api/wines/:wine', function(req, response) {
	var id = req.params.wine;
	wine = redisClient.lrange('wines', id, id, function(err, wine){
		console.log(wine);
		response.render('wine.ejs', {id: id, wine: JSON.parse(wine)}) 
	});
	//response.render('wine.ejs', {id: id, wine: wines[id]}) 
});

app.post('/api/wines', function(req, response) {
	console.log(req.body);
  redisClient.rpush('wines', JSON.stringify(req.body), function(err, wine){
	});
});

app.listen(8080);

