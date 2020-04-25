const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const HEIGHT = 500;
const WIDTH = 500;
const SCALE = 20;
const INTERVAL = 100;

let selectedTheme = document.getElementById("theme-select");

const START_POSITION = function () {
	return {
		x: SCALE * Math.floor(Math.random() * (WIDTH / SCALE)),
		y: SCALE * Math.floor(Math.random() * (HEIGHT / SCALE)),
	};
};

let directionUpdated = false; // Used to prevent changing direction twice in one game tick.

window.addEventListener("change", (event) => {
	theme.changeTheme(selectedTheme.value.toLowerCase());
});

window.addEventListener("keydown", (event) => {
	const direction = event.key.replace("Arrow", "").toLowerCase();
	snake.update(direction);
});

window.addEventListener("beforeunload", (event) => {
	localStorage.setItem("highscore", score.highscore);
});

function setup() {
	canvas.height = HEIGHT;
	canvas.width = WIDTH;
	theme.changeTheme(selectedTheme.value.toLowerCase());
	theme.updateTheme();

	food.createFood();

	window.setInterval(() => {
		directionUpdated = false;

		context.clearRect(0, 0, WIDTH, HEIGHT);
		snake.shiftCells();
		snake.move(snake.xSpeed, snake.ySpeed);
		food.drawFood();
		snake.draw();
		score.drawScore();
	}, INTERVAL);
}

let snake = {
	cells: [{ x: START_POSITION().x, y: START_POSITION().y }],
	xSpeed: 0,
	ySpeed: 0,
	draw: () => {
		for (cell of snake.cells) {
			context.fillStyle = theme.selected.snake;
			context.fillRect(cell.x, cell.y, SCALE, SCALE);
		}
	},
	update: (direction) => {
		switch (direction) {
			case "up":
			case "w":
				if (snake.ySpeed === 1 * SCALE || snake.yspeed === -1 * SCALE || directionUpdated) {
					break;
				}

				snake.ySpeed = -1 * SCALE;
				snake.xSpeed = 0;
				directionUpdated = true;
				break;
			case "down":
			case "s":
				if (snake.ySpeed === -1 * SCALE || snake.ySpeed === 1 * SCALE || directionUpdated) {
					break;
				}

				snake.ySpeed = 1 * SCALE;
				snake.xSpeed = 0;
				directionUpdated = true;
				break;

			case "left":
			case "a":
				if (snake.xSpeed === 1 * SCALE || snake.xSpeed === -1 * SCALE || directionUpdated) {
					break;
				}

				snake.xSpeed = -1 * SCALE;
				snake.ySpeed = 0;
				directionUpdated = true;
				break;

			case "right":
			case "d":
				if (snake.xSpeed === -1 * SCALE || snake.xSpeed === 1 * SCALE || directionUpdated) {
					break;
				}

				snake.xSpeed = 1 * SCALE;
				snake.ySpeed = 0;
				directionUpdated = true;
				break;
		}
	},
	move: (xDist, yDist) => {
		if (snake.cells[0].x == food.position.x && snake.cells[0].y == food.position.y) {
			snake.eat();
		}

		// x-position
		if (snake.cells[0].x + xDist < 0 || snake.cells[0].x + xDist >= WIDTH) {
			snake.die();
		} else {
			snake.cells[0].x += xDist;
		}

		// y-position
		if (snake.cells[0].y + yDist < 0 || snake.cells[0].y + yDist >= HEIGHT) {
			snake.die();
		} else {
			snake.cells[0].y += yDist;
		}

		for (let i = 1; i < snake.cells.length; i++) {
			if (snake.cells[0].x == snake.cells[i].x && snake.cells[0].y == snake.cells[i].y) {
				snake.die();
			}
		}
	},
	shiftCells: () => {
		for (let i = snake.cells.length - 1; i >= 1; i--) {
			snake.cells[i].x = snake.cells[i - 1].x;
			snake.cells[i].y = snake.cells[i - 1].y;
		}
	},
	eat: () => {
		food.createFood();
		snake.grow();
		score.score++;
	},
	grow: () => {
		snake.cells.push({
			x: snake.cells[snake.cells.length - 1].x,
			y: snake.cells[snake.cells.length - 1].y,
		});
	},
	die: () => {
		snake.cells = [{ x: START_POSITION().x, y: START_POSITION().y }];
		snake.xSpeed = 0;
		snake.ySpeed = 0;

		if (score.score > score.highscore) {
			score.highscore = score.score;
		}

		score.reset();
		food.createFood();
	},
};

let food = {
	position: {
		x: 0,
		y: 0,
	},
	createFood: () => {
		food.position.x = SCALE * Math.floor(Math.random() * (WIDTH / SCALE));
		food.position.y = SCALE * Math.floor(Math.random() * (HEIGHT / SCALE));

		// If the new food spawns underneath the snakes body, regenerate it
		for (let i = 0; i < snake.cells.length; i++) {
			if (snake.cells[i].x === food.position.x && snake.cells[i].y === food.position.y) {
				food.createFood();
			}
		}
	},
	drawFood: () => {
		context.fillStyle = theme.selected.food;
		context.fillRect(food.position.x, food.position.y, SCALE, SCALE);
	},
};

let score = {
	highscore: localStorage.getItem("highscore") || 0,
	score: 0,
	drawScore: () => {
		context.fillStyle = theme.selected.text;
		context.textAlign = "right";
		context.fillText("Score: " + score.score, WIDTH - 15, 10);
		context.fillText("Highscore: " + score.highscore, WIDTH - 15, 20);
	},
	reset: () => {
		score.score = 0;
	},
};

const theme = {
	inchworm: {
		snake: "#c2f970",
		background: "#44344f",
		border: "#564d80",
		food: "#EDCB96",
		text: "#ffffff",
	},
	icecream: {
		snake: "#7c3f58",
		background: "#fff6d3",
		border: "#ffe5be",
		food: "#eb6b6f",
		text: "#000000",
	},
	kirokaze: {
		snake: "#94e344",
		background: "#332c50",
		border: "",
		food: "#46878f",
		text: "#ffffff",
	},
	nyx: {
		snake: "#816271",
		background: "#20394f",
		border: "#0f2a3f",
		food: "#f6d6bd",
		text: "#ffffff",
	},
	grayscale: {
		snake: "#000000",
		background: "#b6b6b6",
		border: "#676767",
		food: "#ffffff",
		text: "#ffffff",
	},
	monoramp: {
		snake: "#8b6d9c",
		background: "#272744",
		border: "#494d7e",
		food: "#fbf5ef",
		text: "#ffffff",
	},
	blessing: {
		snake: "#96fbc7",
		background: "#74569b",
		border: "#ffb3cb",
		food: "#f7ffae",
		text: "#ffffff",
	},

	selected: {
		snake: "#c2f970",
		background: "#44344f",
		border: "#564d80",
		food: "#d3fcd5",
		text: "#ffffff",
	},
	changeTheme: (newTheme) => {
		console.log(newTheme);
		theme.selected.snake = theme[newTheme].snake;
		theme.selected.background = theme[newTheme].background;
		theme.selected.border = theme[newTheme].border;
		theme.selected.food = theme[newTheme].food;
		theme.selected.text = theme[newTheme].text;

		theme.updateTheme();
	},
	updateTheme: () => {
		canvas.style.backgroundColor = theme.selected.background;
		canvas.style.borderColor = theme.selected.border;
	},
};
setup();

// For future use
function getWallDistances() {
	return [
		snake.cells[0].y, // North
		WIDTH - SCALE - snake.cells[0].x, // East
		HEIGHT - SCALE - snake.cells[0].y, // South
		snake.cells[0].x, // West
	];
}

function getFoodDistance() {
	return [food.position.x - snake.cells[0].x, food.position.y - snake.cells[0].y];
}
