window.onload = function() {
	var canvasSize = { width: 800, height: 600 };
	var origin = { x: 300, y: 10 };

	var targetPosition = { x: 300, y: 200 };
	var cursorPosition = { x: 300, y: 200 };

	var points = [
		{ x: 300, y: 200 },
		{ x: 300, y: 300 },
		{ x: 400, y: 300 },
		{ x: 400, y: 200 }
	];

	var arm = new SimpleArm({
		segmentSize1: 200,
		segmentSize2: 200
	});

	var canvas = document.getElementById( 'canvas' );
	var seg1 = document.getElementById( 'segment1' );
	var seg2 = document.getElementById( 'segment2' );
	var target = document.getElementById( 'target' );

	canvas.style.width = canvasSize.width + 'px';
	canvas.style.height = canvasSize.height + 'px';

	seg1.style.width = arm.part1 + 'px';
	seg2.style.width = arm.part2 + 'px';

	seg1.style.bottom = origin.y + 'px';
	seg1.style.left = origin.x + 'px';

	seg1.style[ '-webkit-transform-origin' ] = 'left center';
	seg2.style[ '-webkit-transform-origin' ] = 'left center';

	var move = function( current, target ) {
		return {
			x: ArmUtils.lerp( current.x, target.x, 0.1 ),
			y: ArmUtils.lerp( current.y, target.y, 0.1 )
		};
	};

	var index = 0;
	var interval = setInterval( function() {
		targetPosition = points[ index % points.length ];
		index++;
	}, 1000 );

	var render = function() {
		cursorPosition = move( cursorPosition, targetPosition );

		var angles = arm.calculateAngles( 
			cursorPosition.x - origin.x, 
			cursorPosition.y - origin.y
		);

		seg1.style.transform = 'rotate( -' + angles.angle1 + 'rad )';

		seg2.style.bottom = origin.y + 'px';
		seg2.style.left = origin.x + 'px';
		seg2.style.bottom = origin.y + 
			( arm.part1 * Math.sin( angles.angle1 ) )
			+ 'px';
		seg2.style.left = origin.x + 
			( arm.part1 * Math.cos( angles.angle1 ) )
			+ 'px';
		
		var htmlAngle = -1 * ( angles.angle2 - ( Math.PI - angles.angle1 ) )
		seg2.style.transform = 'rotate( ' + htmlAngle + 'rad )';

		target.style.top = (canvasSize.height - cursorPosition.y) + 'px';
		target.style.left = cursorPosition.x + 'px';

		window.requestAnimationFrame( render );	
	}
	render();
}