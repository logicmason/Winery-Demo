var request = require('request');
var url = require('url');
var redis = require('redis');
var express = require('express');

var app = express.createServer();
app.set('view engine', 'ejs');

var wines = [{"name": "Midland Vinyards Red",
							"grapes": "red",
							"country": "Ruritania",
							"region": "Midland slopes",
							"year": "1834",
							"description": "very smooth"}];

app.get('/api/wines', function(req, response) {
	console.log(wines);
	response.render('wines.ejs', {wines:wines});
});

app.get('/api/wines/:wine', function(req, response) {
	var id = req.params.wine;
	console.log(wines[id]);
	response.render('wine.ejs', {id: id, wine: wines[id]}) 
});

app.listen(8080);

