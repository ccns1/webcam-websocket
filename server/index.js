var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('./ws.js')(server);

app.use(express.static(__dirname + '/../app'));

server.listen(3000, function(){
	console.log("Servidor corriendo");
});