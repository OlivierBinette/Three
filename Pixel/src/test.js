
var renderer = new Renderer( 282, 508 );

document.body.appendChild(renderer.getDOMElement());

var textures = {
	background_day : new Texture( 'res/day.png' ),
	background_night : new Texture( 'res/night.png' ),
	fence : new Texture( 'res/fences.png' ),
	birdies : new Texture( 'res/movingbirdie.png' ),
};

var day1 = new Sprite( textures.background_day );
var day2 = new Sprite( textures.background_day );

var background = new Layer( );
day1.transform.position.x = 0;
day2.transform.position.x = 281;
background.addChild( day1 );
background.addChild( day2 );

var birdy = new Birdy( textures.birdies, 100, 20 );

var animator = new Animator( [
	new AnimatedAttribute( background.transform.position, 'x', InterpolationAdjuster.fromType('linear'),
			[ new KeyFrame( 0, 0 ),
			new KeyFrame( -281, 8000) ]
		)
	], Number.POSITIVE_INFINITY, false );

var fenceScroller = new Layer();
var fence1 = new Sprite( textures.fence );
var fence2 = new Sprite( textures.fence );
fence2.transform.position.x = fence1.width - 18;

fenceScroller.transform.position.y = background.height - fence1.height;

fenceScroller.addChild( fence1 );
fenceScroller.addChild( fence2 );

var fenceAnimator = new Animator( [
	new AnimatedAttribute(
			fenceScroller.transform.position, 'x', InterpolationAdjuster.fromType( 'linear' ),
			[ new KeyFrame( 0, 0 ),
			new KeyFrame( - fence1.width, 3000 ) ]
		)
	], Number.POSITIVE_INFINITY, false);


animator.start();
fenceAnimator.start();

document.body.onkeypress = function ( e ) {

	var k = e ? e.which : window.event.keyCode;
	if( k === 32) {
		birdy.jump();
	}

};


var root = new Layer( );
root.addChild( background );
root.addChild( fenceScroller );
root.addChild( birdy );

animate();

function animate () {

	animator.animate();
	fenceAnimator.animate();

	birdy.animate();
	renderer.render( root );

	setTimeout(animate, 17);

}

function Birdy( texture, x, y ) {

	this.transform = new Transform();

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
		y : y
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

		this.frames[i].transform.anchor.x = 0;
		this.frames[i].transform.anchor.y = 0;
		this.frames[i].transform.pivot.x = 17;
		this.frames[i].transform.pivot.y = 16;

		this.frames[i].transform.rotation = this.actualRotation;

		this.frames[i].transform.visible = false;

	}

	this.setPosition = function ( x, y ) {
		for(var i = 0; i < 3; i++) {
			this.frames[i].transform.position.x = x;
			this.frames[i].transform.position.y = y;
		}
	};

	this.update = function ( ) {
		for(var i = 0; i < 3; i++) {
			this.frames[i].transform.position.x = this.position.x;
			this.frames[i].transform.position.y = this.position.y;
			this.frames[i].transform.rotation = this.actualRotation;
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

		this.frames[ Math.floor( actualFrame ) ].transform.visible = false;
		actualFrame += 0.03 * Math.abs( this.speed - this.MAX_SPEED );
		actualFrame %= 3;
		this.frames[ Math.floor( actualFrame ) ].transform.visible = true;
		
	};

	this.draw = function ( context ) {

		for( var i = 0; i < this.frames.length; i++ ) {
			
			this.frames[i].draw( context );

		}

	};

}

