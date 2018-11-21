var w = 800;
var h = 600;
var tileWidth = 30;
var numTilesW = Math.floor(w / tileWidth);
var numTilesH = Math.floor(h / tileWidth);
var mouseIsClicked = false;
var gameOver = false;
var grid = [];

var socket;
var seed;
var room = 100;

window.addEventListener("contextmenu", function(e) {
	e.preventDefault();
})

function Handler() {
	this.gameOver = false;
	this.numRevealed = 0;
	this.tilesMinusBombs = numTilesW * numTilesH;
	this.win = false;
}

var handler = new Handler();

function create2DArray(cols, rows) {
	var grid = new Array(cols);
	for (var i = 0; i < grid.length; i++) {
		grid[i] = new Array(rows);
	}
	return grid;
}

function setup() {
	createCanvas(w, h);

	socket = io.connect('http://localhost:8000');
	var data = {
		roomID: room
	};
	socket.emit('start', data);


	socket.on('updateFlag',
		function(data) {
			grid[data.i][data.j].flagged = data.flagged;
		});

	socket.on('updateReveal',
		function(data) {
			grid[data.i][data.j].reveal(grid, handler);
		});



	socket.on('seed',
		function(data) {
			seed = data;
			console.log(seed);
			Math.seedrandom(seed);
			grid = create2DArray(numTilesW, numTilesH);

			for (var i = 0; i < numTilesW; i++) {
				for (var j = 0; j < numTilesH; j++) {
					var bomb = false;
					if (Math.random() < 0.175) {
						bomb = true;
						handler.tilesMinusBombs -= 1;
					}
					var rectangle = new Tile(i, j, tileWidth, bomb);
					grid[i][j] = rectangle;
				}
			}

			for (var i = 0; i < numTilesW; i++) {
				for (var j = 0; j < numTilesH; j++) {
					grid[i][j].checkTiles(grid);
				}
			}
		}
	);
}

function draw() {
	background(255);
	if (seed != undefined) {
		for (var i = 0; i < numTilesW; i++) {
			for (var j = 0; j < numTilesH; j++) {
				grid[i][j].show();
			}
		}
		if (handler.gameOver) {
			stroke(150, 0, 0);
			strokeWeight(w / 100 - 4);
			fill(255, 0, 0);
			textSize(w / 10);
			textAlign(CENTER, CENTER);
			text("GAME OVER!", w / 2, h / 2);
			strokeWeight(1);
			noLoop();
		}
		if (handler.win) {
			stroke(0, 150, 0);
			strokeWeight(w / 100 - 4);
			fill(0, 255, 0);
			textSize(w / 10);
			textAlign(CENTER, CENTER);
			text("YOU WIN!", w / 2, h / 2);
			strokeWeight(1);
			noLoop();
		}
		mouseIsClicked = false;
	}
}

function mouseReleased() {
	if (mouseButton == RIGHT) {
		for (var i = 0; i < numTilesW; i++) {
			for (var j = 0; j < numTilesH; j++) {
				if (mouseX > i * tileWidth && mouseX < (i + 1) * tileWidth && mouseY > j * tileWidth && mouseY < (j + 1) * tileWidth) {
					grid[i][j].flagged = !grid[i][j].flagged;
					var data = {
						roomID: room,
						i: i,
						j: j,
						flagged: grid[i][j].flagged
					};
					socket.emit('flag', data);
				}
			}
		}
	}
	if (mouseButton == LEFT) {
		for (var i = 0; i < numTilesW; i++) {
			for (var j = 0; j < numTilesH; j++) {
				if (mouseX > i * tileWidth && mouseX < (i + 1) * tileWidth && mouseY > j * tileWidth && mouseY < (j + 1) * tileWidth) {
					grid[i][j].reveal(grid, handler);
					var data = {
						roomID: room,
						i: i,
						j: j,
					};
					socket.emit('reveal', data);
				}
			}
		}
	}

}