//var base64Data = req.rawBody.replace(/^data:image\/png;base64,/, "");
var fs = require('fs');

var users = [];

module.exports = function(server){
	var sio = require('socket.io');

	var ws = sio.listen(server);

	ws.on('connection', function(socket){
		users.push({ id: socket.id, date: Date.now() });
		
		
		socket.emit('ready', { id: socket.id, users: users });
		socket.broadcast.emit("actUser", users);

		socket.on('imagen', function(data){
			var img = data.img;
			var base64Data = img.data.replace(/^data:image\/png;base64,/, "");
			fs.writeFile( img.id + ".png", base64Data, 'base64', function(err) {
			  if(err){ console.log(err); return; }

			  if(data.destination == "all"){
			  	socket.broadcast.emit("imagen", img);
			  } else if( data.destination != '' ){
			  	socket.to(data.destination).emit('imagen', img);
			  }
			});
		});

		socket.on('changeNick', function(nick){
			for( var i =0; i<users.length; i++){
				if(users[i].id == socket.id){
					users[i].name = nick;
				}
			}
			socket.broadcast.emit("actUser", users);
		})

		socket.on("disconnect", function(){
			for( var i =0; i<users.length; i++){
				if(users[i].id == socket.id){
					users.splice( i, 1);
				}
			}
			socket.broadcast.emit("actUser", users);
		})
	});

}