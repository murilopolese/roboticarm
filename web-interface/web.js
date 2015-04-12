// ARDUINO
var five = require("johnny-five");
var PolarArm = require("../polararm");

var board = new five.Board();
var servos;
var polar = new PolarArm( 17 );

var move = function( x, y ) {
	var data = polar.move( x, y );
	servos.arm.to( data.arm );
	servos.claw.to( data.claw );
}

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
});



// INTERWEBZ
var app = require( 'express' )();
var http = require( 'http' ).Server(app);
var io = require( 'socket.io' )(http);

app.get( '/', function(req, res){
	res.sendfile( 'index.html' );
});

io.on('connection', function( socket ){
	console.log( 'a user connected' );
	socket.on('disconnect', function(){
		console.log('user disconnected');
	});
	socket.on( 'position', function( data ) {
		var p = { x: data.left / 14, y: data.top / 14 }
		move( p.x, p.y );
	});
});

http.listen( 3000, function(){
	console.log( 'listening on *:3000' );
});
