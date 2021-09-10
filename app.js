const score = document.querySelector(".score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");

let keys = { ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false };
let player = { speed: 5 };
document.addEventListener("keydown", (e) => {
	keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
	keys[e.key] = false;
});

const moveLine = () => {
	let roadLines = document.querySelectorAll(".roadline");
	roadLines.forEach((elem) => {
		let y = elem.offsetTop;
		y += player.speed;
		if (y > gameArea.offsetHeight - 110) y = -100;
		elem.style.top = y + "px";
	});
};

const isCollide = (car, enemy) => {
	let carRect = car.getBoundingClientRect();
	let enemyRect = enemy.getBoundingClientRect();
	return !(
		carRect.top > enemyRect.bottom ||
		carRect.bottom < enemyRect.top ||
		carRect.left > enemyRect.right ||
		carRect.right < enemyRect.left
	);
};

const moveEnemy = () => {
	let car = document.querySelector(".car");
	let enemyCars = document.querySelectorAll(".enemy");
	enemyCars.forEach((elem) => {
		if (isCollide(car, elem)) {
			player.start = false;
		}
		let y = elem.offsetTop;
		y += player.speed;

		if (y > gameArea.offsetHeight - 110) {
			elem.style.left = Math.floor(Math.random() * 350) + "px";
			y = -100;
		}
		elem.style.top = y + "px";
	});
};

const gamePlay = () => {
	// Car Movement
	let car = document.querySelector(".car");
	if (player.start) {
		moveLine();
		moveEnemy();
		if (keys.ArrowDown && player.y < player.ymax) {
			player.y += player.speed;
		}
		if (keys.ArrowUp && player.y > 80) {
			player.y -= player.speed;
		}
		if (keys.ArrowLeft && player.x > 10) {
			player.x -= player.speed;
		}
		if (keys.ArrowRight && player.x < player.xmax) {
			player.x += player.speed;
		}
		car.style.left = `${player.x}px`;
		car.style.top = `${player.y}px`;
		window.requestAnimationFrame(gamePlay);
	}
};

startScreen.addEventListener("click", () => {
	gameArea.classList.remove("hidden");
	startScreen.classList.add("hidden");

	player.start = true;
	window.requestAnimationFrame(gamePlay);

	// Road lines
	let numberRoadLine = gameArea.offsetHeight / 160;
	for (let i = 0; i < numberRoadLine; i++) {
		let roadline = document.createElement("div");
		roadline.classList.add("roadline");
		gameArea.appendChild(roadline);
		roadline.style.top = 30 + 150 * i + "px";
	}

	// Enemy Cars
	for (let i = 0; i < 3; i++) {
		let enemyCar = document.createElement("div");
		enemyCar.classList.add("enemy");
		gameArea.appendChild(enemyCar);
		enemyCar.style.left = Math.floor(Math.random() * 350) + "px";
		enemyCar.style.top = 230 * i + "px";
	}
	// Car element
	let car = document.createElement("div");
	car.classList.add("car");
	gameArea.appendChild(car);

	// Car Position
	player.x = car.offsetLeft;
	player.y = car.offsetTop;
	player.xmax = gameArea.offsetWidth - car.offsetWidth - 10;
	player.ymax = gameArea.offsetHeight - car.offsetHeight - 10;
});
