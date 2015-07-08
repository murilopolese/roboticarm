window.onload = function() {
	var canvasSize = { width: 800, height: 600 };
	var origin = { x: 300, y: 10 };
	var origin2 = { x: 400, y: 10 };

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
	var arm2 = new SimpleArm({
		segmentSize1: 200,
		segmentSize2: 200
	});

	var canvas = document.getElementById( 'canvas' );
	var seg1 = document.getElementById( 'segment1' );
	var seg2 = document.getElementById( 'segment2' );
	var seg3 = document.getElementById( 'segment3' );
	var seg4 = document.getElementById( 'segment4' );
	var target = document.getElementById( 'target' );

	canvas.style.width = canvasSize.width + 'px';
	canvas.style.height = canvasSize.height + 'px';

	seg1.style.width = arm.part1 + 'px';
	seg2.style.width = arm.part2 + 'px';
	seg3.style.width = arm2.part1 + 'px';
	seg4.style.width = arm2.part2 + 'px';

	seg1.style.bottom = origin.y + 'px';
	seg1.style.left = origin.x + 'px';
	seg3.style.bottom = origin2.y + 'px';
	seg3.style.left = origin2.x + 'px';

	seg1.style[ '-webkit-transform-origin' ] = 'left center';
	seg2.style[ '-webkit-transform-origin' ] = 'left center';
	seg3.style[ '-webkit-transform-origin' ] = 'left center';
	seg4.style[ '-webkit-transform-origin' ] = 'left center';

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
			Math.abs( cursorPosition.x - origin.x ), 
			Math.abs( cursorPosition.y - origin.y )
		);
		var angles2 = arm2.calculateAngles( 
			Math.abs( cursorPosition.x - origin2.x ), 
			Math.abs( cursorPosition.y - origin2.y )
		);

		seg1.style.transform = 'rotate( ' + (-1*angles.angle1) + 'rad )';
		seg3.style.transform = 'rotate( ' + -(Math.PI - angles2.angle1) + 'rad )';

		seg2.style.bottom = origin.y + 
			( arm.part1 * Math.sin( angles.angle1 ) )
			+ 'px';
		seg2.style.left = origin.x + 
			( arm.part1 * Math.cos( angles.angle1 ) )
			+ 'px';

		seg4.style.bottom = origin2.y + 
			( arm2.part1 * Math.sin( Math.PI - angles2.angle1 ) )
			+ 'px';
		seg4.style.left = origin2.x + 
			( arm2.part1 * Math.cos( Math.PI - angles2.angle1 ) )
			+ 'px';
		
		var htmlAngle = - ( angles.angle2 - ( Math.PI - angles.angle1 ) );
		var htmlAngle2 =  Math.PI + ( angles2.angle2 - ( Math.PI - angles2.angle1 ) );
		seg2.style.transform = 'rotate( ' + htmlAngle + 'rad )';
		seg4.style.transform = 'rotate( ' + htmlAngle2 + 'rad )';

		target.style.top = (canvasSize.height - cursorPosition.y) + 'px';
		target.style.left = cursorPosition.x + 'px';

		window.requestAnimationFrame( render );	
	}
	render();
}