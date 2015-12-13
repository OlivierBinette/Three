 
 function Layer( clip ) {

 	this._clip = clip;

 	this._children = [];

 	this.transform = new Transform();
 	this.transform.clip.width = 0;
 	this.transform.clip.height = 0;

 	this.width = 0;
 	this.height = 0;

 };

 Layer.prototype.addChild = function ( child ) {

 	this._children.push( child );
 	
 	if( !this._clip ) {
		this.width = this.transform.clip.width = Math.max( this.width, child.width );
 		this.height = this.transform.clip.width = Math.max( this.height, child.height );
	} 

 };

Layer.prototype.draw = function ( context2D ) {

	if( !this.transform.visible ) { 
		return;
	}

	var t = this.transform;

	context2D.save();

	context2D.translate( 
		t.position.x - t.anchor.x + t.pivot.x, 
		t.position.y - t.anchor.y + t.pivot.y
	);

	context2D.rotate( t.rotation );
	context2D.translate( -t.pivot.x, -t.pivot.y ); 

	if( this._clip && false ) {
		context2D.beginPath();
		context2D.moveTo( t.clip.x, t.clip.y );
		context2D.lineTo( t.clip.x + t.clip.width, t.clip.y );
		context2D.lineTo( t.clip.x + t.clip.width, t.clip.y + t.clip.height );
		context2D.lineTo( t.clip.x, t.clip.y + t.clip.height );
		context2D.closePath();
		context2D.clip();
	}

	for( var i = 0; i < this._children.length; i++ ) {

		this._children[i].draw( context2D );

	}

	context2D.restore();

};






