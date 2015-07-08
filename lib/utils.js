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

	// AMD / RequireJS
	if ( typeof define !== 'undefined' && define.amd ) {
		define( [], function () {
			return ArmUtils;
		});
	}
	// Node.js
	else if ( typeof module !== 'undefined' && module.exports ) {
		module.exports = ArmUtils;
	}
	// included directly via <script> tag
	else {
		root.ArmUtils = ArmUtils;
	}

})();