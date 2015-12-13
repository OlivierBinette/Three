


function Renderer( canvas ) {

	this.canvas = canvas;
	this.context = canvas.getContext( '2d' );

};

	Renderer.prototype.render = function( stage ) {
			
		stage.draw( this.context );

	};


function Stage( ) {

	this._children = [];

	this.position = new Point( 0, 0);

	this.visible = true;

};

	Stage.prototype.addChild = function ( child ) {

		this._children.push( child );

	};

	Stage.prototype.draw = function ( context ) {
		
		context.save();

		context.translate( this.position.x, this.position.y );

		for(var i = 0; i < this._children.length; i++) {

			this._children[i].draw( context );

		}

		context.restore();

	};

function Texture( imgSrc ) {

	this.image = new Image();
	this.image.src = imgSrc;

	this.width = this.image.width;
	this.height = this.image.height;

};



function Sprite( texture, clip ) {

	this._children = [];

	this.texture = texture;
	this.width = this.texture.width;
	this.height = this.texture.height;

	this.position = new Point( 0, 0);
	this.anchor = new Point( 0, 0 );

	this.rotation = 0;
	this.pivot = new Point( 0, 0 );

	this.visible = true;

	this.clip = clip || new Rectangle( 0, 0, this.width, this.height );

};

	Sprite.prototype.draw = function ( context ) {
		
		if( this.visible ) {

			context.save();

			context.translate( 
				this.position.x - this.anchor.x + this.pivot.x, 
				this.position.y - this.anchor.y + this.pivot.y
			);
			context.rotate( this.rotation );
			context.translate( -this.pivot.x, -this.pivot.y ); 

			context.drawImage( this.texture.image, 
				this.clip.x, this.clip.y, 
				this.clip.width, this.clip.height , 
				0, 0, 
				this.clip.width, this.clip.height 
			);

			for( var i = 0; i < this._children.length; i++) {

				this._children[i].draw( context );

			}

			context.restore();

		}

	};

	Sprite.prototype.addChild = function ( child ) {

		this._children.push( child );

	};

	Sprite.prototype.duplicate = function( ) {

		var sprite = new Sprite( this.texture );
		var child;
		for( var i = 0; i < this._children; i++ ) {

			child = 'duplicate' in this._children[i] ? this._children[i].duplicate() : this._children[i];
			sprite.addChild( child ); 
		}

		sprite.clip = this.clip.duplicate();
		sprite.position = this.position.duplicate();
		sprite.anchor = this.anchor.duplicate();
		sprite.rotation = this.rotation;
		sprite.pivot = this.pivot.duplicate();
		sprite.visible = this.visible;

		return sprite;

	};


function Context( width, height ) {

	this._children = [];

	this.position = new Point( 0, 0);
	this.anchor = new Point( 0, 0 );

	this.rotation = 0;
	this.pivot = new Point( 0, 0 );

	this.visible = true;

	this.clip = new Rectangle( 0, 0, width, height );
	
	this.width = width;
	this.height = height;

};

	Context.prototype.addChild = function ( child ) {

		this._children.push( child );

	};

	Context.prototype.setChildren = function ( children ) {

		this._children = children;

	};



	Context.prototype.draw = function ( context ) {

		if(this.visible) {

			context.save();

			context.translate( 
				this.position.x - this.anchor.x + this.pivot.x, 
				this.position.y - this.anchor.y + this.pivot.y
			);

			context.beginPath();
			context.moveTo( this.clip.x, this.clip.y );
			context.lineTo( this.clip.x + this.clip.width, this.clip.y );
			context.lineTo( this.clip.x + this.clip.width, this.clip.y + this.clip.height );
			context.lineTo( this.clip.x, this.clip.y + this.clip.height );
			context.closePath();
			context.clip();

			context.rotate( this.rotation );
			context.translate( -this.pivot.x, -this.pivot.y ); 

			for( var i = 0; i < this._children.length; i++ ) {

				this._children[i].draw( context );

			}

			context.restore();

		}

	};

	Context.prototype.duplicate = function( ) {

		var context = new Context( this.width, this.height );
		var child;
		for( var i = 0; i < this._children.length; i++ ) {

			child = 'duplicate' in this._children[i] ? this._children[i].duplicate() : this._children[i];
			context.addChild( child ); 

		}

		context.position = this.position.duplicate();
		context.anchor = this.anchor.duplicate();
		context.rotation = this.rotation;
		context.pivot = this.pivot.duplicate();
		context.visible = this.visible;

		return context;
	};



function Rectangle( x, y, width, height ) {

	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

};

	Rectangle.prototype.duplicate = function ( ) {
		return new Rectangle( this.x, this.y, this.width, this.height );
	};



function Point( x, y ) {

	this.x = x;
	this.y = y;

};

	Point.prototype.duplicate = function ( ) {
		return new Point( this.x, this.y );
	};



function HorizontalScrollAnimation( scroller, speedX, targetWidth) {

	this.scroller = scroller;

	this.speedX = speedX;

	this.targetWidth = targetWidth;

	this.number = Math.ceil( targetWidth / this.scroller.width ) + 1;

	this.frames = [];

	var frameContext;
	for( var i = 0; i < this.number; i++ ) {
		this.frames.push( this.scroller.duplicate() );

		this.frames[i].position = new Point( ( i ) * scroller.width, 0 );
	}

	this.animate = function () {

		for(var i = 0; i < this.frames.length; i++) {
			
			this.frames[i].position.x += this.speedX;
			if( this.frames[i].position.x < -this.scroller.width ) {
				this.frames[i].position.x = this.scroller.width * ( this.number - 1 );
			}

		}

	};

	this.scrollContext = new Context( targetWidth, this.scroller.height );
	this.scrollContext.setChildren( this.frames );

	this.context = new Context( targetWidth, this.scroller.height );
	this.context.addChild( this.scrollContext );

	this.draw = function ( context2D ) {

		this.context.draw( context2D );

	};

};












