
var renderer = new Renderer( document.getElementById( 'canvas' ) );

var stage = new Stage( );

var textures = {
	background_day : new Texture( 'res/day.png' ),
	background_night : new Texture( 'res/day.png' ),
	fence : new Texture( 'res/fences.png' ),
	birdies : new Texture( 'res/movingbirdie.png' ),
};


var day = new Sprite( textures.background_day );

var fence = new Sprite( textures.fence );
fence.clip.x = 20;


var scroller = new HorizontalScrollAnimation( day, -0.2, 282 );

var bottomScroller = new HorizontalScrollAnimation( fence, -1, 282);

bottomScroller.context.position.y = 100;

scroller.context.addChild( bottomScroller );


var birdy = new Birdy( textures.birdies, 100, 200 );

stage.addChild( scroller );

stage.addChild( birdy );


document.body.onkeypress = function ( e ) {

	var k = e ? e.which : window.event.keyCode;
	if( k === 32) {
		birdy.jump();
	}

};

animate();

function animate() {

	setTimeout( animate, 17 );

	birdy.animate();

	scroller.animate();
	bottomScroller.animate();

	renderer.render( stage );

};





function Birdy( texture, x, y ) {

	/**
	 * The maximal downwards (positive y) speed of the Birdy, per frame.
	 * @type {Number}
	 */
	this.MAX_SPEED = 18;

	/**
	 * The rate of change of the speed of the Birdy, per frame.
	 * @type {Number}
	 */
	this.GRAV_ACCELERATION = 0.7;

	/**
	 * The speed of the Birdy, at the beginning of a jump, per frame.
	 * @type {Number}
	 */
	this.JUMPING_SPEED = -this.MAX_SPEED;

	/**
	 * The actual speed of the Birdy.
	 * @type {Number}
	 */
	this.speed = 0;

	/**
	 * Wether or not the Birdy is naturally descending.
	 * @type {Boolean}
	 */
	this.locked = false;

	/**
	 * The position of the Birdy.
	 */
	this.position = {
		x : x,
		y : x
	};

	this.actualRotation = 0;

	/**
	 * The frames in the Bird's animation.
	 * @type {PIXI.Sprite}
	 */
	this.frames = [];

	/**
	 * Initialisation of the frames.
	 */
	for( var i = 0; i < 3; i++) {

		this.frames[i] = new Sprite( texture, new Rectangle( i * 34, 0, 34, 32) );

		this.frames[i].anchor.x = 0;
		this.frames[i].anchor.y = 0;
		this.frames[i].pivot.x = 17;
		this.frames[i].pivot.y = 16;

		this.frames[i].rotation = this.actualRotation;

		this.frames[i].allVisible = false;

	}

	this.setPosition = function ( x, y ) {
		for(var i = 0; i < 3; i++) {
			this.frames[i].position.x = x;
			this.frames[i].position.y = y;
		}
	};

	this.update = function ( ) {
		for(var i = 0; i < 3; i++) {
			this.frames[i].position.x = this.position.x;
			this.frames[i].position.y = this.position.y;
			this.frames[i].rotation = this.actualRotation;
		}
	}

	/**
	 * Makes the Birdy 'jump' upwards. He is otherwise descending.
	 */
	this.jump = function ( ) {
		this.speed = 0.66 * this.JUMPING_SPEED;
	};

	var actualFrame = 0;

	/**
	 * The animation routine of the Birdy.
	 */
	this.animate = function ( ) {

		if( !this.locked ) {
			//Speed
			if( this.speed < this.MAX_SPEED ) {
				this.speed += this.GRAV_ACCELERATION;
			}

			this.position.y += this.speed;

			this.actualRotation = ( Math.PI - 1 ) * this.speed / ( 2 * this.MAX_SPEED );
		}

		this.update();

		this.frames[ Math.floor( actualFrame ) ].visible = false;
		actualFrame += 0.03 * Math.abs( this.speed - this.MAX_SPEED );
		actualFrame %= 3;
		this.frames[ Math.floor( actualFrame ) ].visible = true;
		
	};

	this.draw = function ( context ) {

		for( var i = 0; i < this.frames.length; i++ ) {
			
			this.frames[i].draw( context );

		}

	};

}