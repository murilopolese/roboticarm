var five = require("johnny-five"),
	board, servos;

board = new five.Board();

var l = 17;

board.on("ready", function() {

	servos = {
		claw: five.Servo({
			pin: 3,
			range: [0, 180]
		}),
		arm: five.Servo(5)
	};
	servos.claw.center();
	servos.arm.center();

	// Inject the `servo` hardware into
	// the Repl instance's context;
	// allows direct command line access
	var inverval = 0;
	var step = 0;
	var maxStep = 7;
	var cycle = 0;
	board.repl.inject({
		s: servos,
		d: d,
		move: move,
		stop: function() { 
			step = 0;
			maxStep = 7;
			cycle = 0;
			servos.claw.center();
			servos.arm.center();
			clearInterval( interval ) 
		},
		square: function() {
			interval = setInterval(function() {
				switch( cycle ) {
					case 0:
						move( 17 - step, 17 );
						break;
					case 1:
						move( 17 - maxStep, 17 - step );
						break;
					case 2:
						move( 17 - maxStep + step, 17 - maxStep );
						break;
					case 3:
						move( 17, 17 - maxStep + step );
						break;
					default:
					break;
				}
				step += 0.5;

				if( step > maxStep ) {
					step = 0;
					cycle++;
				}
				if( cycle > 3 ) {
					cycle = 0;
				};
			}, 50)
		}
	});

});

var toDegrees = function( radians ) {
	return radians * ( 180 / Math.PI );
}
var toRadians = function( degrees ) {
	return degrees * ( Math.PI / 180 );
}

var move = function( x, y ) {
	var claw = toDegrees( beta( x, y, l ) );
	var arm = toDegrees( teta( x, y ) + alpha( x, y, l ) );
	servos.claw.to( claw );
	servos.arm.to( arm );
	return {
		claw: claw,
		arm: arm
	}
}

var d = function( x, y ) {
	return Math.sqrt( Math.pow( x, 2 ) + Math.pow( y, 2 ) );
}

var alpha = function( x, y ) {
	var b = Math.sqrt( Math.pow( l, 2 ) - ( ( Math.pow( x, 2 ) + Math.pow( y, 2 ) ) / 4 ) );
	return Math.asin( b / l );
}

var beta = function( x, y ) {
	return toRadians( 180 ) - ( 2 * alpha( x, y, l ) );
}

var teta = function( x, y ) {
	return Math.atan2( y, x );
}