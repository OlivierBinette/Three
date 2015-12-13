
function InterpolationAdjuster() {};

InterpolationAdjuster.fromType = function ( type ) {
	
	switch ( type ) {
		case 'smooth':
			return InterpolationAdjuster.smooth;
		case 'linear':
			return InterpolationAdjuster.linear;
		case 'smoothIn':
			return InterpolationAdjuster.smoothIn;
		case 'smoothOut':
			return InterpolationAdjuster.smoothOut;
		default:
			return InterpolationAdjuster.linear;
	}

};

InterpolationAdjuster.linear = function ( pos ) {
	return pos;
};

InterpolationAdjuster.smoothOut = function ( pos ) {
	return Math.sin( Math.PI * pos / 2 );
};

InterpolationAdjuster.smoothIn = function ( pos ) {
	return 1 - Math.cos( Math.PI * pos / 2 );
};

InterpolationAdjuster.smooth = function ( pos ) {
	return ( Math.sin( Math.PI * ( pos - 0.5 )) + 1 ) / 2;
};


function Animator( animatedAttributes, maxCycle, autoReverse ) {

	this.animatedAttributes = animatedAttributes;

	this.maxCycle = maxCycle;
	this.autoReverse = autoReverse === undefined ? true : autoReverse ;

};

Animator.prototype.start = function () {

	for (var i = 0; i < this.animatedAttributes.length; i++) {
		this.animatedAttributes[i].maxCycle = this.maxCycle;
		this.animatedAttributes[i].autoReverse = this.autoReverse;
		this.animatedAttributes[i].start();
	};

};

Animator.prototype.animate = function () {

	for (var i = 0; i < this.animatedAttributes.length; i++) {
		this.animatedAttributes[i].update();
	};

};

function AnimatedAttribute( obj, attribute, adjuster, keyFrames ) {

	this.obj = obj;

	this.attribute = attribute;

	this.adjuster = adjuster;

	this.keyFrames = keyFrames;
	this.keyFrames.sort( KeyFrame.compare );

	this.currentTime = 0;

	this.startTime;

	this.currentFrame = 0;

	this.direction = 1;

	this.autoReverse = true;

	this.maxCycle;
};

AnimatedAttribute.prototype.start = function ( ) {

	this.currentCycle = 0;
	this.restart();

};

AnimatedAttribute.prototype.restart = function ( ) {

	this.startTime = new Date().getTime();
	this.currentFrame = 0;
	this.update();

};

AnimatedAttribute.prototype.update = function ( ) {

	if( this.currentCycle >= this.maxCycle ) {
		return;
	}

	var time = new Date().getTime() - this.startTime;

	if( !this.keyFrames[this.currentFrame + this.direction] ) {

		this.currentCycle++;

		if( this.autoReverse ) {
			this.direction *= -1;
		}
		else
		{
			this.restart();
		}

	}

	var pos = ( time - this.keyFrames[this.currentFrame].time ) / ( this.keyFrames[this.currentFrame + this.direction].time - this.keyFrames[this.currentFrame].time );

	pos = this.adjuster( pos );

	this.obj[this.attribute] = this.keyFrames[this.currentFrame].value + pos * ( this.keyFrames[this.currentFrame + this.direction].value - this.keyFrames[this.currentFrame].value );

	if( time > this.keyFrames[this.currentFrame + this.direction].time ) {
		this.currentFrame += this.direction;
		this.obj[this.attribute] = this.keyFrames[this.currentFrame].value;
	}

	//setTimeout( caller( this, this.update ), 0 );

};

function caller( obj, func ) {
	
	return function () {
		func.call(obj);
	}

};

function KeyFrame( value, time ) {

	this.value = value;
	this.time = time;

};

KeyFrame.compare = function ( a, b ) {

	if( a.time < b.time )
		return -1;

	if( a.time === b.time )
		return 0;

	return 1;

};