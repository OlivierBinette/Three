

function Renderer( canvas ) {

	this.canvas = canvas;
	this.context = canvas.getContext( '2d' );

};

Renderer.prototype.render = function( stage ) {
	
	//TODO Clear context
	
	stage.drawWith( this.context );

};


function Stage( ) {

	this.children = [];

	this.position = new Point( 0, 0);

	this.visible = true;

};

Stage.prototype.drawWith = function( context ) {
	
	context.save();

	context.translate( this.position.x, this.position.y );

	for(var i = 0; i < this.children.length; i++) {

		this.children[i].drawWith( context );

	}

	context.restore();

};


function Texture( imgSrc ) {

	this.image = new Image();
	this.image.src = imgSrc;

	this.width = this.image.width;
	this.height = this.image.height;

};

function Event ( name ) {

	this.name = name;

	this.isAlive = true;

	//The dispatcher of the event specifies other properties.

};

function Sprite( texture, clip ) {

	this.texture = texture;

	this.position = new Point( 0, 0);
	this.anchor = new Point( 0, 0 );

	this.rotation = 0;
	this.pivot = new Point( 0, 0 );

	this.clip = clip || new Rectangle( 0, 0, this.texture.width, this.texture.height );

	this.firstVisible = true;

	this.allVisible = true;

	this.children = [];

	this.filters = [];
	this.handlers = [];

};

Sprite.prototype.addEventFilter = function ( filter ) {

	if( !event.isAlive ) {
		return;
	}

	this.filters.push( filter );

};

Sprite.prototype.addEventHandler = function ( handler ) {

	if( !event.isAlive ) {
		return;
	}

	this.handler.push( handler );

};

Sprite.prototype.propagate = function( event ) {

	if( !event.isAlive ) {
		return;
	}

	this.filters.forEach( function ( filter, index, array ) {
		filter( event );
	});

	this.children.forEach( function ( child, index, array ) {
		child.propagate( event );
	});

	this.handlers.forEach( function ( handle, index, array ) {
		handle( event );
	});

};

Sprite.prototype.getBoundingBox = function ( ) {
	
	return new Rectangle( this.position.x, this.position.y, this.clip.width, this.clip.height );

};

Sprite.prototype.drawWith = function ( context ) {
	
	if( this.allVisible ) {

		context.save();

		context.translate( 
			this.pivot.x * this.clip.width + this.position.x - this.anchor.x, 
			this.pivot.y * this.clip.height + this.position.y - this.anchor.y 
		);
		context.rotate( this.rotation );

		if( this.firstVisible ) {
		
			context.drawImage( this.texture.image, 
				this.clip.x, this.clip.y, 
				this.clip.width, this.clip.height , 
				-this.pivot.x * this.clip.width, -this.pivot.y * this.clip.height, 
				this.clip.width, this.clip.height 
			);
		
		}

		context.translate( -this.pivot.x * this.clip.width, -this.pivot.y* this.clip.height );
		
		for(var i = 0; i < this.children.length; i++) {
		
			this.children[i].drawWith( context );
		
		}

		context.restore();

	}

};

Sprite.prototype.duplicate = function() {
	var sprite = new Sprite( this.texture, this.clip.duplicate() );
	sprite.position = this.position.duplicate();
	sprite.anchor = this.anchor.duplicate();
	sprite.rotation = this.rotation;
	sprite.pivot = this.pivot.duplicate();
	sprite.children = this.children.map( function ( child, index, array ) {
		return ( 'duplicate' in child ) ? child.duplicate() : child ;
	});
	return sprite;
};


function Environment( ) {

	this.position = new Point( 0, 0);
	this.anchor = new Point( 0, 0 );

	this.rotation = 0;
	this.pivot = new Point( 0, 0 );

	this.allVisible = true;

	this.children = [];

	this.filters = [];
	this.handlers = [];

};

Environment.prototype.addEventFilter = function ( filter ) {

	if( !event.isAlive ) {
		return;
	}

	this.filters.push( filter );

};

Environment.prototype.addEventHandler = function ( handler ) {

	if( !event.isAlive ) {
		return;
	}

	this.handler.push( handler );

};

Environment.prototype.propagate = function( event ) {

	if( !event.isAlive ) {
		return;
	}

	this.filters.forEach( function ( filter, index, array ) {
		filter( event );
	});

	this.children.forEach( function ( child, index, array ) {
		child.propagate( event );
	});

	this.handlers.forEach( function ( handle, index, array ) {
		handle( event );
	});

};

Environment.prototype.drawWith = function ( context ) {
	
	if( this.allVisible ) {

		context.save();

		context.translate( 
			this.position.x - this.anchor.x, 
			this.position.y - this.anchor.y 
		);
		context.rotate( this.rotation );
		
		for(var i = 0; i < this.children.length; i++) {
		
			this.children[i].drawWith( context );
		
		}

		context.restore();

	}

};

Environment.prototype.duplicate = function() {
	var env = new Environment( );
	env.position = this.position;
	env.anchor = this.anchor;
	env.rotation = this.rotation;
	env.pivot = this.pivot;
	env.children = this.children.map( function ( child, index, array ) {
		return ( duplicate in child ) ? child.duplicate() : child ;
	});
};

function Rectangle( x, y, width, height ) {

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

};

Rectangle.prototype.duplicate = function() {
	return new Rectangle( this.x, this.y, this.width, this.height );
};


function Point( x, y ) {

	this.x = x;
	this.y = y;

};

Point.prototype.duplicate = function() {
	return new Point( this.x, this.y );
};



