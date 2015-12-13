
function Renderer( width, height ) {

	this.canvas = document.createElement( 'canvas' );
	this.canvas.id = 'rendererCanvas';
	this.canvas.width = width;
	this.canvas.height = height;
	this.context2D = this.canvas.getContext( '2d' ); 

};

Renderer.prototype.getDOMElement = function ( ) {

	return this.canvas;

};

Renderer.prototype.render = function ( root ) {
	

	this.context2D.clearRect( 0, 0, this.canvas.width, this.canvas.height );

	root.draw( this.context2D );

};