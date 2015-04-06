var five = require( 'johnny-five' ),
	PolarArm = require( '../polararm' ),
	board, servos;

board = new five.Board();

board.on( 'ready', function() {

	servos = {
		claw: five.Servo({
			pin: 3,
			range: [0, 180]
		}),
		arm: five.Servo(5)
	};
	servos.claw.center();
	servos.arm.center();
	
	var polar = new PolarArm( 17 );
	var positions = [
		{ x: 20, y: 20 },
		{ x: 20, y: 10 },
		{ x: 10, y: 10 },
		{ x: 10, y: 20 }
	];
	var i = 0;
	var current, next;
	var step = 0.1;
	var changeInterval, step;
	var change = function( i ) {
		current = positions[ i % positions.length ];
		next = positions[ (i + 1) % positions.length ];
	}
	board.repl.inject({
		s: servos,
		arm: new PolarArm( 17 ),
		start: function() {
			current = positions[ i % positions.length ];
			next = positions[ (i + 1) % positions.length ];

			step = setInterval(function() {
				current = {
					x: polar.lerp( current.x, next.x, 0.1 ),
					y: polar.lerp( current.y, next.y, 0.1 )
				};
				var data = polar.move( 
					current.x, 
					current.y 
				);
				servos.arm.to( data.arm );
				servos.claw.to( data.claw );

				console.log( current, next );
				if( 
					current.x.toFixed( 1 ) == next.x.toFixed( 1 )
					&& current.y.toFixed( 1 ) == next.y.toFixed( 1 )
				) {
					i++;
					change( i );
				}
			}, 20);
			
		},
		stop: function() {
			clearInterval( step );
		}
	});

});