var express = require('express');
var app = express();
var server = app.listen(8000, listen);

var rooms = [];

function listen() {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

var io = require('socket.io')(server);

setInterval(update, 33);

function update() {
	//io.sockets.emit('update', mice);
}

io.sockets.on('connection',
	function(socket) {

		console.log("We have a new client: " + socket.id);


		socket.on('start',
			function(data) {
				for (var i = 0; i < rooms.length; i++) {
					if (data.roomID == rooms[i].roomID) {
						if (rooms[i].numUsers < 2) {
							rooms[i].numUsers += 1;
							rooms[i].p2 = socket.id;
							io.to(socket.id).emit('seed', rooms[i].seed);
							return;
						} else {

						}
					}
				}
				var temp = {
					roomID: data.roomID,
					seed: Math.floor(Math.random() * 1000000),
					numUsers: 1,
					p1: socket.id,
					p2: undefined
				}
				rooms.push(temp);
				io.to(socket.id).emit('seed', temp.seed);
			}
		);

		socket.on('flag',
			function(data) {
				for (var i = 0; i < rooms.length; i++) {
					if (data.roomID == rooms[i].roomID) {
						io.to(rooms[i].p1).emit('updateFlag', data);
						io.to(rooms[i].p2).emit('updateFlag', data);
					}
				}
			});

		socket.on('reveal',
			function(data) {
				for (var i = 0; i < rooms.length; i++) {
					if (data.roomID == rooms[i].roomID) {
						io.to(rooms[i].p1).emit('updateReveal', data);
						io.to(rooms[i].p2).emit('updateReveal', data);
					}
				}
			});

		socket.on('disconnect', function() {
			console.log("Client has disconnected");
		});
	}
);