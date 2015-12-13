
function Sprite( texture, clip ) {

	this._children = [];

	this.texture = texture;

	this.width = this.texture.width;
	this.height = this.texture.height;

	this.transform = new Transform();
	this.transform.clip = clip || new Rectangle( 0, 0, this.width, this.height );

};

Sprite.prototype.draw = function ( context2D ) {
	
	if( !this.transform.visible ) { 
		return;
	}

	var t = this.transform;

	context2D.save();

	//Transforms
	context2D.translate( 
		t.position.x - t.anchor.x + t.pivot.x, 
		t.position.y - t.anchor.y + t.pivot.y
	);

	context2D.rotate( t.rotation );
	context2D.translate( -t.pivot.x, -t.pivot.y ); 

	//Clip
	/*
	context2D.beginPath();
	context2D.moveTo( 0, 0 );
	context2D.lineTo( t.clip.width, 0 );
	context2D.lineTo( t.clip.width, t.clip.height );
	context2D.lineTo( 0, t.clip.height );
	context2D.closePath();
	context2D.clip();
	*/

	//Elements
	context2D.drawImage( this.texture.image, 
				this.transform.clip.x, this.transform.clip.y, 
				this.transform.clip.width, this.transform.clip.height , 
				0, 0, 
				this.transform.clip.width, this.transform.clip.height 
			);

	for( var i = 0; i < this._children.length; i++ ) {

		this._children[i].draw( context2D );

	}

	context2D.restore();

};