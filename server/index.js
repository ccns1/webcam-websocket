var http = require('http');
var express = require('express');
var io = require('./ws.js');

var server = express();

server.use(express.static(__dirname + '/../app'));

http.createServer(server).listen(3000, function(){
	console.log("Servidor corriendo en el puerto %d", this.address().port);
	io(this);
})