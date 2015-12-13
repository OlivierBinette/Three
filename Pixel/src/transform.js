
function Transform( clip ) {

	this.clip = clip || new Rectangle( 0, 0, 0, 0 );

	this.position = new Vector( 0, 0 );
	this.anchor = new Vector( 0, 0 );

	this.rotation = 0;
	this.pivot = new Vector( 0, 0 );

	this.visible = true;

};


function Rectangle( x, y, width, height ) {

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

};

function Vector( x, y ) {

	this.x = x;
	this.y = y;

};
