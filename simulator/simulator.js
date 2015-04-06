window.onload = function() {
	var stage = document.getElementById( 'stage' );
	var arm = document.getElementById( 'arm' );
	var claw = document.getElementById( 'claw' );

	// Set initial position
	armSize = 300;
	origin = { top: 600, left: 200 };
	clawPosition = { top: origin.top, left: origin.left + armSize }
	setPosition( arm, origin );
	setPosition( claw, clawPosition );
	
	var positions = [
		{ x: 300, y: 300 },
		{ x: 300, y: 200 },
		{ x: 200, y: 200 },
		{ x: 200, y: 300 }
	];
	var i = 0;
	var current, next;
	function change( i ) {
		current = positions[ i % positions.length ];
		next = positions[ (i + 1) % positions.length ];
	}
	function lerp( a, b, t ) {
		return a + t * ( b - a );
	}
	function step() {
		current = {
			x: lerp( current.x, next.x, 0.05 ),
			y: lerp( current.y, next.y, 0.05 )
		};
		move( current.x, current.y, arm, claw )
		requestAnimationFrame( step );
	}

	setInterval(function() {
		i++;
		change( i );
	}, 2000);
	change( i );
	step();
	
}


var move = function( x, y, arm, claw ) {
	var armSize = 300;
	var polar = new PolarArm( armSize );

	var relY = origin.top - y;
	var data = polar.move( x, relY )

	var cursor = document.getElementById( 'cursor' );
	cursor.style.top = y + 'px';
	cursor.style.left = ( x + origin.left ) + 'px';

	data.claw = polar.toDegrees( polar.alpha( x, relY ) - polar.teta( x, relY ) );
	rotate( arm, - data.arm );
	rotate( claw, data.claw );

	var clawPosition = {
		top: origin.top - armSize * Math.sin( polar.toRadians( data.arm ) ),
		left: ( armSize * Math.cos( polar.toRadians( data.arm ) ) ) + origin.left
	}
	setPosition( claw, clawPosition );
}

var setPosition = function( el, position ) {
	el.style.top = position.top + 'px';
	el.style.left = position.left + 'px';
}

var rotate = function( el, deg ) {
	el.style.webkitTransformOrigin = '0% 50%';
	el.style.transformOrigin = '0% 50%';

	el.style.webkitTransform = 'rotate('+deg+'deg)'; 
	el.style.transform       = 'rotate('+deg+'deg)'; 
}