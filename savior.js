//*******************
//  MUST HAVE CODE
//*******************

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var fps = 60;
var previousTimeStamp;
var frames = 0;
var interval = setInterval(getFps, 1000)
//-------------------

//*******************
//      SETUP
//*******************
c.width = window.innerWidth;
c.height = window.innerHeight;
var mouse_x = 0,
  mouse_y = 0;
c.onmousemove = function (event) {
  track_mouse(event);
};
//-------------------

//Pre-load Assets
var assetsLoaded = false;
var loadedSofar = 0;
var prelodaerInstance = preload;
var drawLoadingBarInstace = drawLoadingBar;
prelodaerInstance();

//insure user interaction (otherwise sound will not play)
var userClicked = false;

// Main Globals
var gameState = 1, // 1.menu, 2.combat, 3.how to play, 4.credits, 5.game over
  game_control = new Game_Control(),
  control_switch = [0],
  sound = new Sound(),
  music = new Music_Manager(),
  image_lib = new Image_Library(),
  executioner = new Buttons_Executer();

// Combat Globals
var enemy,
  player,
  modeIndicator,
  instances = [],
  loop_index;

window.onkeydown = function (event) {
  game_control.input(event);
};
// !window.ontouchstart = function(event){game_control.touch_input(event);}
window.onmousedown = function () {
  game_control.mouse_input();
};
window.addEventListener("click", function () {
  if (!userClicked) userClicked = true;
});
requestAnimationFrame(updateCanvas);
//-------------------

//***********************
//      MAIN UPDATE
//***********************
function updateCanvas(timeStamp) {
	if(previousTimeStamp !== timeStamp) {
		frames++;
		//----------------------------------------------
		//				   GAME UPDATE
		//----------------------------------------------
		c.width = window.innerWidth;
		c.height = window.innerHeight;

		if (assetsLoaded && userClicked) {
			game_control.creation_code();
			game_control.update();

			//this loop goes through every existing instance in the game and executes it's update method.
			for (loop_index = 0; loop_index < instances.length; loop_index++) {
				instances[loop_index].update();
			}
		} else {
			drawLoadingBarInstace();
			promptUserToClick();
		}

		previousTimeStamp = timeStamp;
		requestAnimationFrame(updateCanvas);
    }
}
// }
//-------------------

//***************************
//        FUNCTIONS
//***************************

//-----------------------------------
//test functions
function test() {}
//------------------------------------

//generates a random number between 0 (inclusive) and the chosen integer (inclusive).
function random(integer) {
  var rNumber = Math.floor(Math.random() * (integer + 1));
  return rNumber;
}

//generates a random number between int1 (inclusive) and int2 (inclusive).
function random_range(int1, int2) {
  var diff = int2 - int1 + 1; //*
  var rNumber = Math.floor(Math.random() * diff) + int1; //**
  return rNumber;
}

//generates a random integer between int1 (inclusive) and int2 (inclusive) and gives it a random sign (+,-)
function random_sign(int1, int2) {
  var diff = int2 - int1 + 1;
  var rNumber = Math.floor(Math.random() * diff) + int1;
  if (random(1)) {
    return rNumber;
  } else {
    return -rNumber;
  }
}

//distance between 2 points
function distance(x1, y1, x2, y2) {
  var dis;
  dis = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  return dis;
}

//easily draw text to the screen
function draw_text(string, x, y, size = 30, color = "black", font = "Arial") {
  ctx.fillStyle = color;
  ctx.font = `${size}px ${font}`;
  ctx.fillText(string, x, y);
}

function draw_text_block(
  string,
  x,
  y,
  size = 30,
  color = "black",
  font = "Arial"
) {
  var textWithLines = string.split("\n");
  ctx.fillStyle = color;
  ctx.font = `${size}px ${font}`;
  for (var i = 0; i < textWithLines.length; i++) {
    ctx.fillText(textWithLines[i].trim(), x, y + i * size + i * 5);
  }
}

//track mouse position
function track_mouse(event) {
  mouse_x = event.clientX;
  mouse_y = event.clientY;
}

function getFps() {
  console.log('fps:',frames);
  frames = 0;
}
//-------------------

