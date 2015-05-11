var LEFT 	= -1;
var RIGHT 	= 1; 


var ANIM_IDLE_LEFT 	    = 0; 
var ANIM_JUMP_LEFT 	    = 1;
var ANIM_WALK_LEFT 	    = 2;

var ANIM_IDLE_RIGHT	    = 3;
var ANIM_JUMP_RIGHT	    = 4;
var ANIM_WALK_RIGHT	    = 5; 

var ANIM_MAX 			= 6;      //for now


var Player = function() 
{
	//drawing player with each sprite plus each run fun function
	this.sprite = new Sprite("ChuckNorris.png");
	
	//idle left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[0, 1, 2, 3, 4, 5, 6, 7]);
	//idle jump
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[8, 9, 10, 11, 12]);	
	//idle left
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05, 
		[13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]);
	//idle right
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[52, 53, 54, 55, 56, 57, 58]);
	//jump right
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[60, 61, 62, 63, 64]);
	//run right
	this.sprite.buildAnimation(12, 8, 165, 126, 0.05,
		[65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78]);
		
	for (var i = 0; i < ANIM_MAX; ++i)
	{
		this.sprite.setAnimationOffset(i, -55, -88);
	}
	
	this.position 	= new Vector2();
	this.position.x = 11 * TILE;
	this.position.y = 7 * TILE;
	this.width 		= 159;
	this.height 	= 163;

	this.offset = new Vector2();
	this.offset.set(-55, -87);
	
	this.velocity = new Vector2();
	
	this.falling = true;
	this.jumping = false;
	
};
var keyPress = 0;
Player.prototype.update = function(deltaTime)
{
	this.sprite.update(deltaTime)
	
	var left	 = false;
	var right 	 = false;
	var jump     = false;
	
	if(keyboard.isKeyDown(keyboard.KEY_LEFT) == true)
		{
			left = true;
			this.direction = LEFT;
			if (this.Sprite.currentAnimation != ANIM_WALK_LEFT &&
			this.jumping == false &&
			this.falling == false ){
			this.Sprite.setAnimation(ANIM_WALK_LEFT)
			}
			
		}
		if (keyboard.isKeyDown(keyboard.KEY_RIGHT) == true){
			right = true;
			this.direction = RIGHT;
			if (this.Sprite.currentAnimation != ANIM_WALK_RIGHT &&
			this.jumping == false &&
			this.falling == false ){
			this.Sprite.setAnimation(ANIM_WALK_RIGHT)
			}
			
		}
		
		if (keyboard.isKeyDown(keyboard.KEY_SPACE) == true && right)
		{
			jump = true;
			if (this.Sprite.currentAnimation != ANIM_JUMP_LEFT)
			{
				this.Sprite.setAnimation(ANIM_JUMP_RIGHT)
			}
			
		}
		
		if (keyboard.isKeyDown(keyboard.KEY_SPACE) == true)
		{
			jump = true;
			if(this.left == true)
			{
				this.Sprite.setAnimation(ANIM_JUMP_LEFT)
			}
			keyPress++
			
		}
		
		if (keyboard.isKeyDown(keyboard.KEY_SPACE) == true && left)
		{
			jump = true;
			if (this.Sprite.currentAnimation != ANIM_JUMP_LEFT)
			{
				this.Sprite.setAnimation(ANIM_JUMP_LEFT)
			}
			
		}
		
		if (jump == false && this.velocity.x == 0 && this.velocity.y == 0 && keyPress > 0)
		{
			this.Sprite.setAnimation(ANIM_IDLE_LEFT)
		}
		
		if (jump == true && this.velocity.x == 0)
		{
			this.Sprite.setAnimation(ANIM_JUMP_LEFT) 
		}
		
		if (jump == true && this.velocity.x == 0)
		{
			this.Sprite.setAnimation(ANIM_JUMP_LEFT)
		}
		
		if (jump == true && keyPress == 0 && this.currentAnimation != ANIM_IDLE_LEFT)
		{
			this.Sprite.setAnimation(ANIM_IDLE_LEFT)
		}
		
	
		
		if (jump == false && this.velocity.x == 0 && this.direction == LEFT)
		{
			this.Sprite.setAnimation(ANIM_IDLE_LEFT)
		};
		
		if (this.velocity.x == 0 && this.direction == LEFT)
		{
			this.Sprite.setAnimation(ANIM_IDLE_LEFT)
		}
			
		if (this.velocity.x == 0 && this.direction == RIGHT)
		{
			this.Sprite.setAnimation(ANIM_IDLE_RIGHT)
		}
		
		if (this.velocity.y == 0 && this.velocity.x == 0 && this.direction == RIGHT)
		{
			this.Sprite.setAnimation(ANIM_IDLE_RIGHT)
		};
	
		
		var wasLeft = this.velocity.x < 0;
		var wasRight = this.velocity.x > 0;
		var falling = this.falling;
		var acceleration = new Vector2();
			acceleration.y = GRAVITY;
		
		if (left)
			acceleration.x += BACCEL;
		else if (wasLeft)
			acceleration.x += FRICTION;
			
		if (right)
			acceleration.x += ACCEL;
		else if (wasRight)
			acceleration.x -= FRICTION;
		
		if ( jump && !this.jumping && !falling)
		{
			acceleration.y += JUMP;
			this.jumping -= true;
		};
		
		// adds our current velocity
		
		this.position.y = Math.floor(this.position.y + (deltaTime * this.velocity.y));
		this.position.x = Math.floor(this.position.x + (deltaTime * this.velocity.x));
		
		this.velocity.x = bound(this.velocity.x + (deltaTime * acceleration.x), -MAXDX, MAXDX);
		this.velocity.y = bound(this.velocity.y + (deltaTime * acceleration.y), -MAXDY, MAXDY);

		if (wasLeft && (this.velocity.x > 0) || 
			wasRight && (this.velocity.x < 0))
			this.velocity.x = 0;
		
		var Tx = pixelToTile(this.position.x);
		var Ty = pixelToTile(this.position.y);
		
		var nx = (this.position.x) % TILE;
		var ny = (this.position.y) % TILE;
		
		var cell = cellAtTileCoord(LAYER_PLATFORMS, Tx, Ty);
		var cellUp = cellAtTileCoord(LAYER_PLATFORMS, Tx, Ty +1);
		var cellRight = cellAtTileCoord(LAYER_PLATFORMS, Tx + 1, Ty);
		var cellLeft = cellAtTileCoord(LAYER_PLATFORMS, Tx - 1, Ty);
		var cellDown = cellAtTileCoord(LAYER_PLATFORMS, Tx, Ty + 1);
		var cellDiag = cellAtTileCoord(LAYER_PLATFORMS, Tx + 1, Ty + 1);
		
		//////////////////////////
		//// check collision ////
		////  downwards		////
		///////////////////////
		if (this.velocity.y > 0)
		{
			if((cellDown && !cell) || (cellDiag && !cellRight && nx ))
			{
				this.position.y = tileToPixel(Ty);
				this.velocity.y = 0;
				this.falling = false;
				this.jumping = false;
				this.land = true;
				ny = 0; // no longer overlapping the cell below
			}
		}
		////upwards
		else if (this.velocity.y < 0)
		{
			if((cell && !cellDown) || (cellRight && !cellDiag && nx))
			{
				this.position.y = tileToPixel(Ty+ 1);
				this.velocity.y = 0;
				
				cell = cellDown;
				cellRight = cellDiag;
				ny = 0;
			}
		}
		////right
		if (this.velocity.x > 0)
		{
			if((cellRight && !cell) || (cellRight && !cellDiag && ny))
			{
				this.position.x = tileToPixel(Tx);
				this.velocity.x = 0; 
			}
		}
	////left
		if (this.velocity.x < 0)
		{
			if((cellLeft && !cell) || (cellLeft && !cellDiag && ny))
			{
			this.position.x = tileToPixel (Tx) + 1;
			this.velocity.x = 0;
			}
		}
	};

Player.prototype.draw = function()
{	
	
	this.Sprite.draw(context, this.position.x - worldOffsetX, this.position.y)
	

};
