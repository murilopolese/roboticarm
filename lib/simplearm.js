(function() {
	
	// global on the server, window in the browser
	var root = this;

	var ArmUtils = function() {};

	// Angle unit conversion
	ArmUtils.toDegrees = function( radians ) {
		return radians * ( 180 / Math.PI );
	}
	ArmUtils.toRadians = function( degrees ) {
		return degrees * ( Math.PI / 180 );
	}
	// The distance between origin and a given point
	ArmUtils.range = function( x, y ) {
		return Math.sqrt( Math.pow( x, 2 ) + Math.pow( y, 2 ) );
	}
	// The angle between the range and the x axix (polar coordinates)
	ArmUtils.alpha = function( x, y ) {
		return Math.atan( y / x );
	}
	// Movemente linear interpolation
	ArmUtils.lerp = function( a, b, t ) {
		return a + t * ( b - a );
	}
	// Find the angle in radians in the opposite direction of the first given 
	// side for a triangle you know the three sides
	ArmUtils.calculateAngleSSS = function( A, B, C ) {
		return Math.acos(
			( Math.pow( B, 2 ) + Math.pow( C, 2 ) - Math.pow( A, 2 ) ) /
			( 2 * B * C )
		);
	}


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
	}

	// AMD / RequireJS
	if ( typeof define !== 'undefined' && define.amd ) {
		define( [], function () {
			return {
				SimpleArm: SimpleArm,
				ArmUtils: ArmUtils
			};
		});
	}
	// Node.js
	else if ( typeof module !== 'undefined' && module.exports ) {
		module.exports = {
			SimpleArm: SimpleArm,
			ArmUtils: ArmUtils
		};
	}
	// included directly via <script> tag
	else {
		root.SimpleArm = SimpleArm;
		root.ArmUtils = ArmUtils;
	}

})();