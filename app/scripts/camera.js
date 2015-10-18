navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

URL = window.URL || window.mozURL || window.webkitURL;

var App = {};
App.camara = function(){
	var canvas = window.preview;
	var video = window.stream;
	var btn = window.tomarFoto;
	var listado = window.listado;
	var imagen = {};

	navigator.getUserMedia({video: 1}, function(stream){
		video.src = URL.createObjectURL(stream);

		btn.addEventListener('click', function(){
			canvas.getContext('2d')
			.drawImage(video, 0, 0, 300, 230);

			imagen.id = 'imagen-' + Date.now();
			imagen.data = canvas.toDataURL('image/png');
			
			App.ws.emit('imagen', {img: imagen, destination: App.destination });
		});
	}, function(err){
		alert("ERROR!");
	})
}

App.ws = io.connect('ws://' + location.host);
App.ws.on('ready', function(obj){
	App.user = {
		id: obj.id
	}
	actualizarUsers(obj.users);
});
App.ws.on('imagen', function(img){
	listado.innerHTML += '<div class="col-xs-6 col-md-3 col-lg-2"><a href="#" class="thumbnail"><img src="' + img.data + '" alt="' + img.id + '"></a></div>';
})
App.ws.on('actUser', function(users){
	actualizarUsers(users);
})
App.camara();

function actualizarUsers(users){
	App.users = users;
	listUsuarios = window.usuarios;
	listUsuarios.innerHTML = '';
	users.map(function(user){
		if(user.id == App.user.id) return;
		var name = user.name ? user.name : user.id;
		listUsuarios.innerHTML += '<li class="list-group-item" onclick="selectUser(\'' + user.id + '\')">' + name + '</li>';
	})
	
}

function selectUser(id){
	var name;
	App.destination = id;
	for(var i=0; i < App.users.length; i++){
		if(App.users[i].id == id)
			name = App.users[i].name ? App.users[i].name : App.users[i].id;
	}
	window.toText.innerHTML = "Para: " + name;
}

window.nickInput.addEventListener('change', function(){
	if(this.value == ''){
		alert("El nombre no debe estar en blanco");
		this.value = App.user.name;
		return;
	}
	
	App.user.name = this.value;
	App.ws.emit('changeNick', this.value);
	
});