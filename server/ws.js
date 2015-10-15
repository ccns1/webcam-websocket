//var base64Data = req.rawBody.replace(/^data:image\/png;base64,/, "");
var fs = require('fs');


module.exports = function(server){
	var sio = require('socket.io');

	var ws = sio.listen(server);

	ws.on('connection', function(socket){
		console.log("nuevo cliente");
		socket.emit('ready');

		socket.on('imagen', function(img){
			var base64Data = img.data.replace(/^data:image\/png;base64,/, "");
			fs.writeFile( img.id + ".png", base64Data, 'base64', function(err) {
			  if(err){ console.log(err); return; }

			  socket.broadcast.emit('imagen', img);
			});
		})
	})
}