(function( ArmUtils ) {
	
	// global on the server, window in the browser
	var root = this;

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
			return SimpleArm;
		});
	}
	// Node.js
	else if ( typeof module !== 'undefined' && module.exports ) {
		module.exports = SimpleArm;
	}
	// included directly via <script> tag
	else {
		root.SimpleArm = SimpleArm;
	}

})( ArmUtils );