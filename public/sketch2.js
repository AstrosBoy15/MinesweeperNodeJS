var socket;

var mice = [];

function setup() {
	createCanvas(600, 600);
	socket = io.connect('http://localhost:8000');

	var data = {
		x: mouseX,
		y: mouseY
	};

	socket.emit('start', data);

	socket.on('update',
		function(data) {
			mice = data;
		}
	);
}

function draw() {
	background(0);
	var data = {
		x: mouseX,
		y: mouseY
	};
	socket.emit('step', data);
	for (var i = 0; i < mice.length; i++) {
		if (mice[i].id != socket.id) {
			ellipse(mice[i].x, mice[i].y, 5, 5);
		}
	}
}