(function() {
	
	// global on the server, window in the browser
	var root = this;

	var PolarArm = function( armSize ) {
		this.l = armSize || 10;
	};

	// Angle unit conversion
	PolarArm.prototype.toDegrees = function( radians ) {
		return radians * ( 180 / Math.PI );
	}
	PolarArm.prototype.toRadians = function( degrees ) {
		return degrees * ( Math.PI / 180 );
	}

	// The distance between origin and a given point
	PolarArm.prototype.range = function( x, y ) {
		return Math.sqrt( Math.pow( x, 2 ) + Math.pow( y, 2 ) );
	}

	// The equal angles in a isosceles triangle formed by the arm
	PolarArm.prototype.alpha = function( x, y ) {
		return Math.acos( this.range( x, y ) / ( 2 * this.l ) );
	}
	// The odd angle in a isosceles triangle formed by the arm
	PolarArm.prototype.beta = function( x, y ) {
		return this.toRadians( 180 ) - ( 2 * this.alpha( x, y ) );
	}

	PolarArm.prototype.teta = function( x, y ) {
		return Math.atan2( y, x );
	}

	PolarArm.prototype.move = function( x, y ) {
		var arm = this.toDegrees( this.alpha( x, y ) + this.teta( x, y ) );
		var claw = this.toDegrees( this.beta( x, y ) );
		var polar = {
			range: this.range( x, y ),
			teta: this.toDegrees( this.teta( x, y ) )
		}
		return {
			claw: claw,
			arm: arm,
			polar: polar
		}
	}

	// Movemente linear interpolation
	PolarArm.prototype.lerp = function( a, b, t ) {
		return a + t * ( b - a );
	}

	// AMD / RequireJS
	if ( typeof define !== 'undefined' && define.amd ) {
		define( [], function () {
			return PolarArm;
		});
	}
	// Node.js
	else if ( typeof module !== 'undefined' && module.exports ) {
		module.exports = PolarArm;
	}
	// included directly via <script> tag
	else {
		root.PolarArm = PolarArm;
	}

})();
