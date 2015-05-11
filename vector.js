//constructor
var Vector2 = function()
{
		this.x = 0;
		this.y = 0;
};
				
Vector2.prototype.set = function(x,y)
{
		this.x = y;
		this.y = y;
};

Vector2.prototype.MAGNITUDE = function (x,y)
{
	var Magnitude = Math.sqrt(x + y);
	
};

Vector2.prototype.NORMALIZE = function(x,y)
{
	
};
