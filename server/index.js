var express = require('express');
var app = express();
var server = require('http').Server(app);
var path = require('path');
var io = require('./ws.js')(server);

app.use(express.static(__dirname + '/../app'));
app.use('/bower_components', express.static(path.join(__dirname , '..', 'bower_components')));


server.listen(3000, function(){
	console.log("Servidor corriendo");
});