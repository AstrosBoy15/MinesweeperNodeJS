function Tile(x, y, width, hasBomb) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.hasBomb = hasBomb;
	this.revealed = false;
	this.flagged = false;
	this.num = 0;

	this.show = function(grid) {
		stroke(0);
		if (!this.revealed) {
			fill(200);
			rect(x * this.width - 1, y * this.width - 1, this.width, this.width);
			if (this.flagged == true) {
				fill(255, 0, 0);
				noStroke();
				rect(x * this.width + this.width / 4 - 1, y * this.width + this.width / 4 - 1, this.width / 2, this.width / 2);
			}
		} else {
			fill(225);
			rect(x * this.width - 1, y * this.width - 1, this.width, this.width);
			if (this.hasBomb) {
				fill(0);
				ellipse(x * this.width + this.width / 2 - 1, y * this.width + this.width / 2 - 1, this.width / 2, this.width / 2);
			} else if (this.num != 0) {
				noStroke();
				fill(255, 0, 255);
				textSize(this.width / 2);
				textAlign(CENTER, CENTER);
				text(this.num, x * this.width + this.width / 2 - 1, y * this.width + this.width / 2 - 1);
			}
		}
	}

	this.checkTiles = function() {
		for (var i = this.x - 1; i <= this.x + 1; i++) {
			for (var j = this.y - 1; j <= this.y + 1; j++) {
				if (i >= 0 && j >= 0 && i < grid.length && j < grid[i].length) {
					if (grid[i][j].hasBomb == true) {
						this.num += 1;
					}
				}
			}
		}
	}

	this.reveal = function(grid, handler) {
		this.revealed = true;
		handler.numRevealed += 1;
		if (this.num == 0) {
			this.fillSurrounding(grid, handler);
		}
		if (this.hasBomb == true) {
			handler.gameOver = true;
			this.revealAll(grid);
		}
		if (handler.numRevealed == handler.tilesMinusBombs) {
			handler.win = true;
		}
	}

	this.fillSurrounding = function(grid, handler) {
		for (var i = this.x - 1; i <= this.x + 1; i++) {
			for (var j = this.y - 1; j <= this.y + 1; j++) {
				if (i >= 0 && j >= 0 && i < grid.length && j < grid[i].length) {
					if (!grid[i][j].revealed) {
						grid[i][j].revealed = true;
						handler.numRevealed += 1;
						if (grid[i][j].num == 0) {
							grid[i][j].fillSurrounding(grid, handler);
						}
					}
				}
			}
		}
	}

	this.revealAll = function(grid) {
		for (var i = 0; i < grid.length; i++) {
			for (var j = 0; j < grid[i].length; j++) {
				grid[i][j].revealed = true;
			}
		}
	}


}