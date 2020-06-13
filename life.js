// logic inside this class called "Life"

(function () {
	var _ = (self.Life = function (seed) {
		this.seed = seed; // seed is the grid of cells which is the board's initial state
		this.height = seed.length;
		this.width = seed[0].length;

		this.prevBoard = [];
		this.board = cloneArray(seed); // we set previous state to empty array and clone seed to curent board position
	});

	_.prototype = {
		next: function () {
			this.prevBoard = cloneArray(this.board); // here we close current position to prev board
			for (let y = 0; y < this.height; y++) {
				for (let x = 0; x < this.width; x++) {
					let neighbors = this.aliveNeighbors(this.prevBoard, x, y); // calculates how many live neighbours each cell has
					// console.log(x, y, ':', neighbors);

					let alive = !!this.board[y][x]; // only alive cells i.e, those with value 1

					if (alive) {
						if (neighbors < 2 || neighbors > 3) {
							this.board[y][x] = 0; // makes htese cells to die if conditions are met
						}
					} else {
						if (neighbors == 3) {
							this.board[y][x] = 1; // makes these cells to 'get life' if this condition is met
						}
					}
				}
			}

			return this.board; // fresh drawn board is returned
		},

		aliveNeighbors: function (array, x, y) {
			let sum = 0;
			let prevRow = array[y - 1] || [];
			let nextRow = array[y + 1] || [];

			// the above is to avoid undefined thrown by calling property on undefined cell, (top row and bottom row)
			// these 2 rows return empty array due to || OR

			//below loop calculates the sum of checked cells of 8 neighbors, 3 above, 3 below and 2 to the sides
			// of current cell
			[
				prevRow[x - 1],
				prevRow[x],
				prevRow[x + 1],
				array[y][x - 1],
				array[y][x + 1],
				nextRow[x - 1],
				nextRow[x],
				nextRow[x + 1],
			].forEach((a) => {
				sum += +!!a;
			});

			return sum;
		},
		toString: function () {
			return this.board.map((row) => row.join(' ')).join('\n');
		},
	};

	// helpers
	// helper function to clone 2d array
	function cloneArray(array) {
		return array.slice().map((row) => row.slice());
	}
})();

// var game = new Life([
// 	[0, 0, 0, 0, 0],
// 	[0, 0, 1, 0, 0],
// 	[0, 0, 1, 0, 0],
// 	[0, 0, 1, 0, 0],
// 	[0, 0, 0, 0, 0],
// ]);

// console.log(game + '');
// game.next();
// console.log(game + '');
// game.next();
// console.log(game + ' ');

// below is render class called "LifeView"

(function () {
	let _ = (self.LifeView = function (table, size) {
		this.grid = table;
		this.size = size;
		this.createGrid();
	});
	_.prototype = {
		createGrid: function () {
			var fragment = document.createDocumentFragment();
			this.grid.innerHtml = '';
			this.checkboxes = [];

			for (let y = 0; y < this.size; y++) {
				let row = document.createElement('tr');
				this.checkboxes[y] = [];
				for (let x = 0; x < this.size; x++) {
					let cell = document.createElement('td');
					let checkbox = document.createElement('input');
					checkbox.type = 'checkbox';
					this.checkboxes[y][x] = checkbox;
					cell.appendChild(checkbox);
					row.appendChild(cell);
				}
				fragment.appendChild(row);
			}
			this.grid.appendChild(fragment);
		},
		get boardArray() {
			return this.checkboxes.map((row) => row.map((cb) => +cb.checked));
		},

		play: function () {
			this.game = new Life(this.boardArray);
		},

		next: function () {
			this.game.next();
			var board = this.game.board;
			for (let y = 0; y < this.size; y++) {
				for (let x = 0; x < this.size; x++) {
					this.checkboxes[y][x].checked = !!board[y][x];
				}
			}
		},
	};
})();

// const noGrid = document.getElementById('no-grid')

var lifeView = new LifeView(document.getElementById('grid'), 14);
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const autoplay = document.getElementById('autoplay');

playBtn.addEventListener('click', () => {
	lifeView.play();
});

nextBtn.addEventListener('click', () => {
	lifeView.next();
});

autoplay.addEventListener('change', () => {
	setInterval(() => {
		lifeView.next();
	}, 500);
});
