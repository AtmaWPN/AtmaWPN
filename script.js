// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 669;
document.body.appendChild(canvas);

var gamestate = "menu";

//all the colors
var red = "rgb(255, 0, 0)";
var blue = "rgb(0, 0, 255)";
var green = "rgb(0, 255, 0)";
var yellow = "rgb(255, 255, 0)";
var lblue = "rgb(0, 255, 255)";
var purple = "rgb(255, 0, 255)";
//not for guesses
var white = "rgb(255, 255, 255)";
var black = "rgb(0, 0, 0)";

var cursorX = 0;
var cursorY = 0;
var mouseX = 300;
var mouseY = 300;

var colors = [red, green, blue, yellow, lblue, purple];
var colorsmaster = [red, green, blue, yellow, lblue, purple];
var coloramount = 6;
var guesslength = 4;

var wait = false;

var guesscount = 0;
var guess = [black, black, black, black];
var guesses = [];
var code = [];
var score = [black, black, black, black];
var scores = [];
var approved = 0
var scoredloc = [];
var scoredcode = [];
var won = 0;

var length = 4;

var i;
var j;

var keysDown = {};

var canvasClick = function (event) {
	mouseX = event.clientX - canvas.offsetLeft + document.body.scrollLeft;
	mouseY = event.clientY - canvas.offsetTop + document.body.scrollTop;
}

//sets a random code
var randomCode = function () {
	code = [];
	while (code.length < length) {
		code[code.length] = colors[Math.floor(Math.random() * colors.length)]
	}
};

//draws the background, color options, and some dev stuff for testing
var staticDisplay = function () {
    ctx.fillStyle = black;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = colors[0];
    ctx.fillRect(6, 6, 64, 64);
    ctx.fillStyle = green;
    ctx.fillRect(6, 6 + 64, 64, 64);
    ctx.fillStyle = blue;
    ctx.fillRect(6, 6 + (2 * 64), 64, 64);
    ctx.fillStyle = yellow;
    ctx.fillRect(6, 6 + (3 * 64), 64, 64);
    ctx.fillStyle = lblue;
    ctx.fillRect(6, 6 + (4 * 64), 64, 64);
    ctx.fillStyle = purple;
    ctx.fillRect(6, 6 + (5 * 64), 64, 64);
	//reset button
    ctx.fillStyle = white;
    ctx.fillRect(canvas.width - 100, canvas.height - 100, 96, 96);
	ctx.fillStyle = black;
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("RESET", canvas.width - 92, canvas.height - 62);
	//display the code, for testing purposes
	/*ctx.fillStyle = code[0];
	ctx.fillRect(6, canvas.height - 70, 64, 64);
	ctx.fillStyle = code[1];
	ctx.fillRect(6 + 64, canvas.height - 70, 64, 64);
	ctx.fillStyle = code[2];
	ctx.fillRect(6 + (2 * 64), canvas.height - 70, 64, 64);
	ctx.fillStyle = code[3];
	ctx.fillRect(6 + (3 * 64), canvas.height - 70, 64, 64);*/
	//dev numbers
	/*ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font = "12px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("guesses length = " + guesses.length, 450, 500);
	ctx.fillText(guesses[0], 450, 515);
	ctx.fillText(guesses[1], 450, 530);
	ctx.fillText(guesses[2], 450, 545);
	ctx.fillText(guesses[3], 450, 560);
	ctx.fillText(mouseX, 450, 575);
	ctx.fillText(mouseY, 450, 590);*/
};

//draws all past guesses
var drawGuesses = function () {
	for (i = 0; i < guesses.length; i++) {
		for (j = 0; j < guesses[i].length; j++) {
			ctx.fillStyle = guesses[i][j];
			ctx.fillRect(76 + (j * 64), 6 + (i * 64), 64, 64);
		}
	}
};

//draws the current guess
var drawGuess = function () {
	for (i = 0; i < guess.length; i++) {
		ctx.fillStyle = guess[i];
		ctx.fillRect(76 + (i * 64), 6 + (guesscount * 64), 64, 64);
	}
};

//this scores the guess
var check = function () {
	scoredloc = [];
	scoredcode = [];
	for (i = 0; i < guess.length; i++) {
		if (code[i] == guess[i]) {
			score[approved] = red;
			approved++;
			scoredcode[i] = 2;
		}
	}
	for (i = 0; i < guess.length; i++) {
		for (j = 0; j < guess.length; j++) {
			if (code[i] == guess[j] && scoredcode[i] != 2 && scoredcode[j] != 2 && scoredcode[i] != 1 && scoredloc[j] != 1) {
				score[approved] = white;
				approved++;
				scoredcode[i] = 1;
				scoredloc[j] = 1;
			}
		}
	}
	scores[scores.length] = score;
	if (score[score.length - 1] == red) {
		won = 1;
	}
	score = [black, black, black, black];
	approved = 0;
};

//draw all scores for all guesses
var drawScores = function () {
	for (i = 0; i < scores.length; i++) {
		for (j = 0; j < scores[i].length; j++) {
			ctx.fillStyle = scores[i][j];
			ctx.fillRect(340 + (j * 54), 14 + (i * 64), 48, 48);
		}
	}
};

//check if the guess is full
var fullGuess = function () {
	for (i=0; i < guess.length; i++) {
		if(guess[i] == black) {
			i=69;
		}
	}
	if (i == guess.length) {
		return true;
	} else if (i == 69) {
		return false;	
	}
};

// Update game objects
var update = function () {
	if (38 in keysDown && cursorY >= 1 && wait == false) { // Player holding up
		cursorY--;
        wait = true;
	} else if (38 in keysDown && cursorY == 0 && wait == false) { // Player holding up
		cursorY = 5;
        wait = true;
    }
	if (40 in keysDown && cursorY <= 4 && wait == false) { // Player holding down
		cursorY++;
        wait = true;
	} else if (40 in keysDown && cursorY == 5 && wait == false) { // Player holding up
		cursorY = 0;
        wait = true;
    }
	if (37 in keysDown && cursorX >= 1 && wait == false) { // Player holding up
		cursorX--;
        wait = true;
	} else if (37 in keysDown && cursorX == 0 && wait == false) { // Player holding up
		cursorX = 3;
        wait = true;
    }
	if (39 in keysDown && cursorX <= 2 && wait == false) { // Player holding down
		cursorX++;
        wait = true;
	} else if (39 in keysDown && cursorX == 3 && wait == false) { // Player holding up
		cursorX = 0;
        wait = true;
    }
    if (13 in keysDown && cursorX <= 2 && wait == false) { // Player holding enter
		guess[cursorX] = colors[cursorY];
		cursorX++;
        wait = true;
	} else if (13 in keysDown && cursorX == 3 && wait == false) { // Player holding enter
		guess[cursorX] = colors[cursorY];
		cursorX = 0;
        wait = true;
    }
	if (32 in keysDown && wait == false && fullGuess() == true) { // Player holding space
		guesses[guesses.length] = guess;
		check();
		guess = [black, black, black, black];
		guesscount++;
        wait = true;
	}
};

//render game objects
var render = function () {
    staticDisplay();
	drawGuesses();
	drawGuess();
	if (guesscount < 10 && won == 0) {
		//up/down selection cursor
		ctx.strokeStyle = white;
		ctx.strokeRect(6, 6 + (cursorY * 64), 63, 63);
		ctx.strokeRect(6, 6 + (cursorY * 64), 64, 64);
		ctx.strokeRect(6, 6 + (cursorY * 64), 65, 65);
		//left/right selection cursor
		ctx.strokeStyle = white;
		ctx.strokeRect(76 + (cursorX * 64), 6 + (guesscount * 64), 63, 63);
		ctx.strokeRect(76 + (cursorX * 64), 6 + (guesscount * 64), 64, 64);
		ctx.strokeRect(76 + (cursorX * 64), 6 + (guesscount * 64), 65, 65);
	}
	drawScores();
};

var menuDisplay = function () {
	ctx.fillStyle = black;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = white;
	ctx.font = "69px Helvetica";
	ctx.textAlign = "center";
	ctx.textBaseline = "center";
	ctx.fillText("MASTERMIND", canvas.width / 2, 69);
	//hitbox testing rectangles
	/*ctx.fillRect((canvas.width / 2) - 58, (canvas.height / 2) - 18, 116, 36);
	ctx.fillRect((canvas.width / 2) - 80, (canvas.height / 2) + 30, 160, 36);
	ctx.fillStyle = black;*/
	ctx.font = "36px Helvetica";
	ctx.fillText("START", canvas.width / 2, canvas.height / 2 + 10);
	ctx.fillText("OPTIONS", canvas.width / 2, canvas.height / 2 + 60);
};

var menuUpdate = function () {
	if (mouseX > ((canvas.width / 2) - 58) && mouseX < ((canvas.width / 2) + 58) && mouseY > ((canvas.height / 2) - 18) && mouseY < ((canvas.height / 2) + 18)) {
		gamestate = "game";
	}
	if (mouseX > ((canvas.width / 2) - 80) && mouseX < ((canvas.width / 2) + 80) && mouseY > ((canvas.height / 2) + 30) && mouseY < ((canvas.height / 2) + 66)) {
		gamestate = "select";
	}
};

var menuRender = function () {
	//currently useless
};

var optionDisplay = function () {
	ctx.fillStyle = black;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = white;
	ctx.font = "69px Helvetica";
	ctx.textAlign = "center";
	ctx.textBaseline = "center";
	//testing rectangle for back button hitbox
	//ctx.fillRect((canvas.width / 2) - 40, canvas.height - 95, 80, 30);
	//ctx.fillStyle = black;
	ctx.fillText("OPTIONS", canvas.width / 2, 69);
	ctx.font = "30px Helvetica";
	ctx.fillText("COLORS: " + coloramount, canvas.width / 2, 260);
	ctx.fillText("GUESS LENGTH: " + guesslength, canvas.width / 2, canvas.height - 260);
	ctx.fillText("BACK", canvas.width / 2, canvas.height - 69);
	//triangle arrows
	
};

var optionUpdate = function () {
	if (mouseX > ((canvas.width / 2) - 40) && mouseX < ((canvas.width / 2) + 40) && mouseY > (canvas.height - 95) && mouseY < (canvas.height - 65)) {
		gamestate = "menu";
	}
};

var optionRender = function () {
	
};

var main = function () {
	if (gamestate == "menu") {
		menuDisplay();
		menuUpdate();
		menuRender();
	} else if (gamestate == "select") {
		optionDisplay();
		optionUpdate();
		optionRender();
	} else if (gamestate == "game") {
		staticDisplay();
		if (won == 0) {
			update();
		} else if (won == 1) {
			alert("You Won in " + guesscount + " guesses!");
			won = 2;
			
		}
		if (guesscount >= 10 && won == 0) {
			alert("You Lose!");
			won = 3;
		}
		//reset button
		if (mouseX >= (canvas.width - 100) && mouseY >= (canvas.height - 100)) {
			reset();
		}
		render();
	}
	requestAnimationFrame(main);
};

var reset = function () {
	randomCode();
	cursorX = 0;
	cursorY = 0;
	mouseX = 300;
	mouseY = 300;
	guesscount = 0;
	guess = [black, black, black, black];
	guesses = [];
	score = [black, black, black, black];
	scores = [];
	won = 0;
	wait = false;
	keysDown = {};
};

// Handle keyboard controls I won't pretend I know what's going on here
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
    wait = false;
}, false);

addEventListener("click", canvasClick, false);

randomCode();
main();
























