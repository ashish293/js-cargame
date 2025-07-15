const score = document.querySelector(".score");
const startScreen = document.querySelector(".startScreen");
const gameArea = document.querySelector(".gameArea");
const carSound = new Audio("music/car.mp3");
const crashSound = new Audio("music/crash.mp3");


let keys = { ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false, " ": false };
let player = { speed: 5, score: 0 };

document.addEventListener("keydown", (e) => {
        keys[e.code] = true;
});
document.addEventListener("keyup", (e) => {
        keys[e.code] = false;
});


// For Adjusting Game Area Size and Score Box Size for Mobile Devices 
if (window.innerWidth > 359 && window.innerWidth < 431) {
	gameArea.style.width = `${window.innerWidth}px`;
	gameArea.style.top = '0%';
	gameArea.style.left = '0%';
	gameArea.style.margin = '0px';
	gameArea.style.position = 'fixed';
	gameArea.style.transform = 'translate(-0%, -0%)';
        document.querySelector('p').style.fontSize = '20px'; 
        startScreen.style.width = '300px';
	
} else {
	gameArea.style.width = '400px';
	gameArea.style.top = '';
	gameArea.style.left = '';
	gameArea.style.margin = 'auto';
	gameArea.style.position = 'relative';
	gameArea.style.transform = '';
}

if (window.innerHeight > 665 && window.innerHeight < 933) {
	gameArea.style.height = '90vh';
	let y = (0.91 * window.innerHeight);
	let x = (0.15 * window.innerWidth);
	score.style.transform = `translate(${x}px, ${y}px)`;
	score.style.width = '300px';
;
} else {
	gameArea.style.height = '100vh';
	score.style.position = 'absolute';
        score.style.width = '300px';
        score.style.height = '80px';
        score.style.top = '10px';
        score.style.left = '10px';
	score.style.transform = `rotate(-5deg)`;
}


const setScore = (score) => {
        let localeScore = localStorage.getItem("topScore");
        if (score > localeScore) {
                localStorage.setItem("topScore", score);
        }
};

const moveLine = () => {
        let roadLines = document.querySelectorAll(".roadline");
        roadLines.forEach((elem) => {
        	   // For Shifting RoadLines to Middle for Mobile Devices
        	    if (window.innerWidth > 359 && window.innerWidth < 431) {
	               elem.style.left = `${window.innerWidth/2}px`;
	            } else {
		           elem.style.left = '195px';
                }
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

const moveEnemy = async () => {
        let car = document.querySelector(".car");
        let enemyCars = document.querySelectorAll(".enemy");

        enemyCars.forEach((elem) => {
                if (isCollide(car, elem)) {
                        player.start = false;
                        document.querySelector(".startScreen").classList.remove("hidden");
                        setScore(player.score);
                        carSound.pause();
                        crashSound.play();
                }
                let y = elem.offsetTop;
                y += player.speed;

                if (y > gameArea.offsetHeight - 120) {
                        elem.style.left = Math.floor(Math.random() * 350) + "px";
                        y = -100;
                        let n = Math.floor(Math.random() * 5);
                        elem.src = `images/car${n}.png`;
                }
                elem.style.top = y + "px";

                // Score
                let score = document.querySelector(".currScore");
                score.innerText = "Score: " + player.score;
                player.score++;
                if (player.score % 500 == 0) {
                        player.speed++;
                }
        });
};

                
// Mobile Touch Input 
window.addEventListener('touchmove' ,  async (e) => {
        e.preventDefault();
        let x = Math.floor(e.touches[0].clientX);
        if(x < (window.innerWidth-50)){
                player.x = x;
        }
} , { passive: false});
                
                
                

const gamePlay = async () => {
        // Car Movement
        let car = document.querySelector(".car");
        if (player.start) {
                moveLine();
                moveEnemy();
                
                
                // Keyboard Input
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

const gameStart = async () => {
        gameArea.classList.remove("hidden");
        startScreen.classList.add("hidden");
        gameArea.innerHTML = "";
        player.score = 0;
        player.speed = 5;
        if (carSound.paused) {
                carSound.play();
        } else {
                carSound.currentTime = 0;
        }
        // For top Score
        let topScr = localStorage.getItem("topScore");
        document.querySelector(".topScore").innerText = "Top Score: " + (topScr ? topScr : 0);

        player.start = true;

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
                let enemyCar = document.createElement("img");
                let n = Math.floor(Math.random() * 5);
                enemyCar.src = `images/car${n}.png`;
                enemyCar.classList.add("enemy");
                gameArea.appendChild(enemyCar);
                enemyCar.style.left = Math.floor(Math.random() * (gameArea.innerWidth - 20)) + "px"; 
                enemyCar.style.top = 230 * i - 200 + "px";
        }
        // Car element

        let car = document.createElement("img");
        car.classList.add("car");
        car.setAttribute("src", "images/car.png");
        gameArea.appendChild(car);

        // Car Position
        car.style.top = gameArea.offsetHeight - 150 + "px";
        car.style.left = 100 + "px";
        player.x = car.offsetLeft;
        player.y = car.offsetTop;
        player.xmax = gameArea.offsetWidth - car.offsetWidth - 10;
        player.ymax = gameArea.offsetHeight - car.offsetHeight - 10;

        window.requestAnimationFrame(gamePlay);
};

startScreen.addEventListener("click", gameStart);
document.addEventListener("keydown", () => {
        if (!player.start && keys.Space) {
                gameStart();
        }
});