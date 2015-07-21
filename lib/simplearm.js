(function() {
	
	// global on the server, window in the browser
	var root = this;

	var ArmUtils = function() {};

	// Angle unit conversion
	ArmUtils.toDegrees = function( radians ) {
		return radians * ( 180 / Math.PI );
	};
	ArmUtils.toRadians = function( degrees ) {
		return degrees * ( Math.PI / 180 );
	};
	// The distance between origin and a given point
	ArmUtils.range = function( x, y ) {
		return Math.sqrt( Math.pow( x, 2 ) + Math.pow( y, 2 ) );
	};
	// The angle between the range and the x axix (polar coordinates)
	ArmUtils.alpha = function( x, y ) {
		return Math.atan( y / x );
	};
	// Movemente linear interpolation
	ArmUtils.lerp = function( a, b, t ) {
		return a + t * ( b - a );
	};

	// Cossine rule: A is the angle, b and c are the adjacent sides
	// ASS: Angle, side, side
	ArmUtils.calculateSideASS = function( A, b, c ) {
		return Math.sqrt( 
			Math.pow( b, 2 ) + Math.pow( c, 2 ) - ( 2 * b * c * Math.cos( A ) )
		);
	};
	// Find the angle in radians in the opposite direction of the first given 
	// side for a triangle you know the three sides.
	// SSS: Side, side, side
	ArmUtils.calculateAngleSSS = function( A, B, C ) {
		return Math.acos(
			( Math.pow( B, 2 ) + Math.pow( C, 2 ) - Math.pow( A, 2 ) ) /
			( 2 * B * C )
		);
	};


	var SimpleArm = function( opt ) {
		opt = opt || {};
		this.part1 = opt.segmentSize1 || 1;
		this.part2 = opt.segmentSize2 || 1;
	};

	SimpleArm.prototype.calculateAngles = function( x, y ) {
		var range = ArmUtils.range( x, y );
		var alpha = ArmUtils.alpha( x, y );
		var a = ArmUtils.calculateAngleSSS( this.part2, range, this.part1 );
		var c = ArmUtils.calculateAngleSSS( range, this.part1, this.part2 );
		return {
			angle1: a + alpha,
			angle2: c
		}
	};

	var DoubleArm = function( opt ) {
		opt = opt || {};
		this.part1 = opt.segmentSize1 || 1;
		this.part2 = opt.segmentSize2 || 1;
		this.distance = opt.distance || 1;
	};

	DoubleArm.calculateAngles = function( x, y ) {
		// The distance between the origin and the point (x,y)
	    var triangle1Range = ArmUtils.range( x, y );
	    // The angle between the x axis and the vector (x,y)
	    var alpha = Math.atan( y / x );
	    // The angle between the vector (x,y) and where the arm should be
	    var triangle1Angle = ArmUtils.calculateAngleSSS( 
	      this.part2, this.part1, triangle1Range 
	    );
	    // The servo 1 angle
	    var angle1 = triangle1Angle + alpha;


	    var triangle2Range = ArmUtils.calculateSideASS(
	      alpha, triangle1Range, this.distance
	    );

	    var triangle2Angle = ArmUtils.calculateAngleSSS(
	      this.part2, triangle2Range, this.part1
	    );

	    var triangleCenterAngleRight = ArmUtils.calculateAngleSSS(
	      triangle1Range, this.distance, triangle2Range
	    );

	    var angle2 = Math.PI - triangle2Angle - triangleCenterAngleRight;

	    return {
	      angle1: angle1,
	      angle2: angle2
	    }
	}



	// AMD / RequireJS
	if ( typeof define !== 'undefined' && define.amd ) {
		define( [], function () {
			return {
				SimpleArm: SimpleArm,
				DoubleArm: DoubleArm,
				ArmUtils: ArmUtils
			};
		});
	}
	// Node.js
	else if ( typeof module !== 'undefined' && module.exports ) {
		module.exports = {
			SimpleArm: SimpleArm,
			DoubleArm: DoubleArm,
			ArmUtils: ArmUtils
		};
	}
	// included directly via <script> tag
	else {
		root.SimpleArm = SimpleArm;
		root.DoubleArm = DoubleArm;
		root.ArmUtils = ArmUtils;
	}

})();