const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const HEIGHT = 500;
const WIDTH = 500;
const SCALE = 20;
const INTERVAL = 100;

const START_POSITION = { x: 20, y: 20 };

window.addEventListener("keydown", (event) => {
	const direction = event.key.replace("Arrow", "");
	snake.update(direction);
});

function setup() {
	canvas.height = HEIGHT;
	canvas.width = WIDTH;
	food.createFood();

	window.setInterval(() => {
		context.clearRect(0, 0, WIDTH, HEIGHT);
		snake.shiftCells();
		snake.move(snake.xSpeed, snake.ySpeed);
		food.drawFood();
		snake.draw();
		score.drawScore();
	}, INTERVAL);
}

let snake = {
	cells: [{ x: START_POSITION.x, y: START_POSITION.y }],
	xSpeed: SCALE,
	ySpeed: 0,
	draw: () => {
		for (cell of snake.cells) {
			context.fillStyle = "#C2F970";
			context.fillRect(cell.x, cell.y, SCALE, SCALE);
		}
	},
	update: (direction) => {
		switch (direction) {
			case "Up":
				if (snake.ySpeed === 1 * SCALE) {
					break;
				}

				snake.ySpeed = -1 * SCALE;
				snake.xSpeed = 0;
				break;
			case "Down":
				if (snake.ySpeed === -1 * SCALE) {
					break;
				}

				snake.ySpeed = 1 * SCALE;
				snake.xSpeed = 0;
				break;

			case "Left":
				if (snake.xSpeed === 1 * SCALE) {
					break;
				}

				snake.xSpeed = -1 * SCALE;
				snake.ySpeed = 0;
				break;

			case "Right":
				if (snake.xSpeed === -1 * SCALE) {
					break;
				}

				snake.xSpeed = 1 * SCALE;
				snake.ySpeed = 0;
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
		snake.grow();
		food.createFood();
		score.score++;
	},
	grow: () => {
		snake.cells.push({
			x: snake.cells[snake.cells.length - 1].x,
			y: snake.cells[snake.cells.length - 1].y,
		});
	},
	die: () => {
		snake.cells = [{ x: START_POSITION.x, y: START_POSITION.y }];
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
			if (snake.cells[i].x == food.position.x && snake.cells[0].y == food.position.y) {
				food.createFood();
			}
		}
	},
	drawFood: () => {
		context.fillStyle = "#D3FCD5";
		context.fillRect(food.position.x, food.position.y, SCALE, SCALE);
	},
};

let score = {
	highscore: 0,
	score: 0,
	drawScore: () => {
		context.fillStyle = "white";
		context.textAlign = "right";
		context.fillText("Score: " + score.score, WIDTH - 15, 10);
		context.fillText("Highscore: " + score.highscore, WIDTH - 15, 20);
	},
	reset: () => {
		score.score = 0;
	},
};
setup();