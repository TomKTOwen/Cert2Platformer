var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");

//setting up delta time variables
var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

var STATE_GAME = 0;
var STATE_GAMEOVER = 1;
var STATE_SPLASH = 2;

var gameState = STATE_SPLASH;

var Music = new Howl(
	{
		urls:["background.ogg"],
		loop:true,
		buffer:true,
		volume:0.5
	});
Music.play();

var SplashBackground = document.createElement("img");
	SplashBackground.src = "splash_background.png";

var heartImage = document.createElement("img");
	heartImage.src = "heart.png";
	
// This function will return the time in seconds since the function 
// was last called
// You should only call this function once per frame
function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

		// Find the delta time (dt) - the change in time since the last drawFrame
		// We need to modify the delta time to something we can use.
		// We want 1 to represent 1 second, so if the delta is in milliseconds
		// we divide it by 1000 (or multiply by 0.001). This will make our 
		// animations appear at the right speed, though we may need to use
		// some large values to get objects movement and rotation correct
	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
		// validate that the delta is within range
	if(deltaTime > 0.03)
		deltaTime = 0.03;
		
	return deltaTime;
}

//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;


// some variables to calculate the Frames Per Second (FPS - this tells use
// how fast our game is running, and allows us to make the game run at a 
// constant speed)
var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

 // abitrary choice for 1m
var METER = TILE;
 // very exaggerated gravity (6x)
var GRAVITY = METER * 9.8 * 6;
 // max horizontal speed (10 tiles per second)
var MAXDX = METER * 10;
 // max vertical speed (15 tiles per second)
var MAXDY = METER * 15;
 // horizontal acceleration - take 1/2 second to reach maxdx
var ACCEL = MAXDX * 2;
 // horizontal friction - take 1/6 second to stop from maxdx
var FRICTION = MAXDX * 6;
 // (a large) instantaneous jump impulse
var JUMP = METER * 1500;

var cells = [];

function initializeCollision()
{
	//loop through each layer
	for ( var layerIdx = 0 ; layerIdx < LAYER_COUNT ; ++layerIdx )
	{
		cells[layerIdx] = [];
		var index = 0;
	
		//loop through each row
		for ( var y = 0 ; y < level1.layers[layerIdx].height ; ++y)
		{
			cells[layerIdx][y] = [];
		
			//loop through each cell
			for ( var x = 0 ; x < level1.layers[layerIdx].width ; ++x)
			{
				//if the tile for this cell is not empty
				if ( level1.layers[layerIdx].data[index] != 0 )
				{
					//set the 4 cells around it to be colliders
					cells[layerIdx][y][x] = 1;
					cells[layerIdx][y][x+1] = 1;
					cells[layerIdx][y-1][x+1] = 1;
					cells[layerIdx][y-1][x] = 1;
				}
				
				//if the cell hasn't already been set to 1, set it to 0
				else if (cells[layerIdx][y][x] != 1 )
				{
					cells[layerIdx][y][x] = 0;
				}
				
				++index;
			}
		}
	}
}

function tileToPixel(tile_coord)
{
	return tile_coord * TILE;
}

function pixelToTile(pixel)
{
	return Math.floor(pixel / TILE);
}

function bound(value, min, max)
{
	if (value < min)
		return min;
	if (value > max)
		return max; 
	return value;
}

function cellAtTileCoord(layer, tx, ty)
{
	//if off the top, left or right of the map
	if ( tx < 0 || tx > MAP.tw || ty < 0 )
	{
		return 1;
	}
	
	//if off the bottom of the map
	if ( ty >= MAP.th )
	{
		return 0;
	}
	
	return cells[layer][ty][tx];
}

function cellAtPixelCoord(layer, x, y)
{
	var tx = pixelToTile(x);
	var ty = pixelToTile(y);
	
	return cellAtTileCoord(layer, tx, ty);
}



var keyboard = new Keyboard();
var player = new Player();

//adding score and lives!!
var score = 0;
var lives = 3

function runGame(deltaTime)
{	
	
	context.fillStyle = "#8EBBEB";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	drawMap();
	
	context.fillStyle = "DAE90D";
	context.font = "32px Arial"
	var scoreText = "SCORE: " + score;
	context.fillText = (scoreText, SCREEN_WIDTH - 170, 35);
	
	for (var i = 0; i < lives; i++)
	{
		context.drawImage (heartImage, 20 + ((heartImage.width + 2) * i), 10); 
	}
	
	player.update(deltaTime);
	player.draw(context);

	// update the frame counter 
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}		
		
	//// draw the FPS
	//context.fillStyle = "#f00";
	//context.font="14px Arial";
	//context.fillText("FPS: " + fps, 5, 20, 100);
	
	
	
	if (Player.lives == 0)
	{
		gameState = STATE_GAMEOVER;
		return;
	}
	
	if (Player.health == 3)
	{
		gameState = STATE_GAMEOVER;
		return;
	}
}

function runGameOver(deltaTime)
{
	Music.stop();
	
	context.fillStyle = "#000";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	context.fillStyle = "#F00";
	context.font="100px Arial";
	context.fillText("MWAHAHAHA", 300, 400);
	
}

function runWin(deltaTime)
{
	Music.stop();
	
	context.fillStyle = "#8EBBEB"
	context.fillRect(0,0, canvas.width, canvas.height);
	
	context.fillStyle = "#66BA5A";
	context.font="100px Arial";
	context.fillText("YOU WIN!!!!", 300, 400);
}

var splashTimer = 3;
function runSplash(deltaTime)
{
		splashTimer -= deltaTime;
	if(splashTimer <= 0)
	{
		gameState = STATE_GAME;
		return;
	}
	
	context.fillStyle = "#AAE31A"
	context.fillRect(0,0, canvas.width, canvas.height);
	context.drawImage( SplashBackground, 0, 0);
	
	}



function run()
{
	
	var deltaTime = getDeltaTime();
	
	switch(gameState)
	{
		case STATE_GAME:
			runGame(deltaTime);
			break;
		case STATE_GAMEOVER:
			runGameOver(deltaTime);
			break;
		case STATE_SPLASH:
			runSplash(deltaTime);
	}
}


initializeCollision();

//-------------------- Don't modify anything below here


// This code will set up the framework so that the 'run' function is called 60 times per second.
// We have a some options to fall back on in case the browser doesn't support our preferred method.
(function() {
  var onEachFrame;
  if (window.requestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.requestAnimationFrame(_cb); }
      _cb();
    };
  } else if (window.mozRequestAnimationFrame) {
    onEachFrame = function(cb) {
      var _cb = function() { cb(); window.mozRequestAnimationFrame(_cb); }
      _cb();
    };
  } else {
    onEachFrame = function(cb) {
      setInterval(cb, 1000 / 60);
    }
  }
  
  window.onEachFrame = onEachFrame;
})();

window.onEachFrame(run);
