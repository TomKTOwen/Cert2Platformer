var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
var startFrameMillis = Date.now();
var endFrameMillis = Date.now();

function getDeltaTime()
{
	endFrameMillis = startFrameMillis;
	startFrameMillis = Date.now();

	var deltaTime = (startFrameMillis - endFrameMillis) * 0.001;
	
	if(deltaTime > 0.03)
		deltaTime = 0.03;
		
	return deltaTime;
}
//-------------------- Don't modify anything above here

var SCREEN_WIDTH = canvas.width;
var SCREEN_HEIGHT = canvas.height;

var fps = 0;
var fpsCount = 0;
var fpsTime = 0;

var splashTimer 	= 100;
var winTimer 		= 100;
var loseTimer 		= 100;
var STATE_SPLASH 	= 0;
var STATE_GAME 		= 1;
var STATE_END 		= 2;
var STATE_WIN 		= 3;
var GAME_STATE 		= STATESPLASH;

var METER = TILE;
var GRAVITY = METER * 9.8 * 6;
var MAXDX = METER * 10;
var MAXDY = METER * 15;
var ACCEL = MAXDX * 2;
var BACCEL = MAXDX * -2;
var FRICTION = MAXDX * 6;
var JUMP = METER * -1500;
var LIVES = 3;
var land = true;

var SplashBackground = document.createElement("img");
	SplashBackground.src = "splash_background.png";

var Heart = document.createElement("img");
	Heart.src = "heart.png";


var keyboard = new Keyboard();
var player = new Player();

var Music = new Howl(
	{
		urls:["background.ogg"],
		loop:true,
		buffer:true,
		volume:0.5
	});
Music.play();

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

function tileToPixel(tile)
{
	return tile * TILE;
};

function pixelToTile(pixel)
{
	return Math.floor(pixel / TILE);
};


function cellAtPixelCoord(layer, x, y)
{
	var tx = pixelToTile(x);
	var ty = pixelToTile(y);
	
	return cellAtTileCoord(layer, tx, ty);
}

function bound(value, min, max)
{
	if (value < min)
		return min;
	if (value > max)
		return max;
		
	return value;
};



function runSplash(deltaTime)
{
	if (splashTimer > 0)
	{
		splashTimer --
	}	
	
	if ( splashTimer == 0) 
	{
		GAMESTATE = STATEGAME
	}
	
	context.fillStyle = "#AAE31A"
	context.fillRect(0,0, canvas.width, canvas.height);
	context.drawImage( SplashBackground, 0, 0);
	
}

function runGame(deltaTime)
{
	//background for in game
	context.fillStyle = "#78A0CA";		
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.font="14px Arial";
	context.fillText(LIVES, 5, 100, 100);
	drawMap();
	player.update(deltaTime);
	player.draw(context);
	winTimer = 100;
	loseTimer = 100;
	
	context.draw = Heart;
	
	
	if (LIVES == 3)
	{
		context.drawImage(Heart, 120, 25)
		context.drawImage(Heart, 130, 25)
		context.drawImage(Heart, 140, 25)
	};
	
	if (LIVES == 2)
	{
		context.drawImage(Heart, 130, 25)
		context.drawImage(Heart, 120, 25)
	};                    
	                      
	if (LIVES == 1)       
	{                     
		context.drawImage(Heart, 120, 25)
	};
	
	if (player.position.x >= 2044 && player.position.y >= 420)
	{
		GAME_STATE = STATE_WIN
	}
	
	if (player.position.y > 600 || player.position.x < 0)
	{
		player.position.y = 7 * TILE;
		player.position.x = 11 * TILE;
		LIVES --;
		player.Sprite.setAnimation(ANIM_IDLE_LEFT);
	};
	
	if (LIVES == 0)
	{
		GAME_STATE = STATE_END
	};
};
	


function runGameOver(deltaTime)
{
	context.fillStyle = "#000";
	context.font = "40px Arial";
	context.fillText( "MWAHAHAHAHAHA TRY AGAIN", SCREEN_HEIGHT/2, SCREEN_WIDTH/3);
	
	if (loseTimer > 0)
	{
		loseTimer --
	}	
	
	if ( loseTimer == 0) 
	{
		GAMESTATE = STATEGAME;
		LIVES = 3;
	}
};
	
}

function runWin(deltaTime)
{
	context.fillStyle = "#000";
	context.font = "40px Arial";
	context.fillText( "CONGRATULATIONS!!! YOU WIN", SCREEN_HEIGHT/2, SCREEN_WIDTH/3);
	
	if (winTimer > 0)
	{
		winTimer --
	}	
	
	if ( winTimer == 0) 
	{
		GAMESTATE = STATEGAME;
		LIVES = 3;
		player.position.y = 7 * TILE;
		player.position.x = 11 * TILE;
		player.Sprite.setAnimation(ANIM_IDLE_LEFT);
	}
}

function run()
{	
	var deltaTime = getDeltaTime();
	
	fpsTime += deltaTime;
	fpsCount++;
	if(fpsTime >= 1)
	{
		fpsTime -= 1;
		fps = fpsCount;
		fpsCount = 0;
	}			
	//GAMESTATES
	

	switch(GAMESTATE)
	{
		case STATESPLASH:
			RUNSPLASHSCREEN(deltaTime);
		break;
		 
		case STATEGAME:
			RUNGAMESCREEN(deltaTime);
		break;
		
		case STATEEND:
			RUNGAMEOVER(deltaTime);
		break;
		
		case STATEWIN:
			RUNGAMEWIN(deltaTime);
		break;
	};

	// draw the FPS
	context.fillStyle = "#f00";
	context.font="14px Arial";
	context.fillText("FPS: " + fps, 5, 20, 100);
	context.fillText("x " + player.position.x + " y " + player.position.y, 5, 40, 100);
	context.fillText(splashTimer +" "+ winTimer +" "+ loseTimer, 5, 60, 100);
	context.fillText(GAMESTATE, 5, 80, 100);
	context.fillText(KEYPRESS, 5, 120, 100);
};

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
