var five = require("johnny-five"),
  board = new five.Board(),
  SimpleArm = require("../lib/simplearm").SimpleArm,
  ArmUtils = require("../lib/simplearm").ArmUtils;
  DoubleArm = require("../lib/simplearm").DoubleArm;

board.on("ready", function() {
  servos = {
    servo1: five.Servo(9),
    servo2: five.Servo(3)
  };
  servos.servo1.center();
  servos.servo2.center();

  // Z
  // var points = [
  //   { x: 6, y: 1 },
  //   { x: 6, y: 5 },
  //   { x: 4, y: 1 },
  //   { x: 4, y: 5 },
  //   { x: 2, y: 1 },
  //   { x: 2, y: 5 }
  // ];

  // Heart
  var points = [
    { x: 4, y: 4 },
    { x: 5, y: 6 },
    { x: 6, y: 3 },
    { x: 4, y: 1 },
    { x: 2, y: 3 },
    { x: 3, y: 6 }
  ];

  var targetPosition = points[ 0 ];
  var cursorPosition = points[ 0 ];

  var arm = new DoubleArm({
    segmentSize1: 9.5,
    segmentSize2: 9.5,
    distance: 8
  });

  var move = function( current, target ) {
    var lerpFactor = 0.2;
    return {
      x: ArmUtils.lerp( current.x, target.x, lerpFactor ),
      y: ArmUtils.lerp( current.y, target.y, lerpFactor )
    };
  };

  var step = function() {
    // Get a point
    targetPosition = points[ index % points.length ];

    // Iterate untill the 
    cursorPosition = move( cursorPosition, targetPosition );

    var a = arm.calculateAngles( cursorPosition.x, cursorPosition.y );
    var angles = arm.calculateAngles( cursorPosition.x, cursorPosition.y );

    servos.servo1.to( ArmUtils.toDegrees( angles.angle1 ) );
    servos.servo2.to( ArmUtils.toDegrees( angles.angle2 ) );

    if(
        cursorPosition.x.toFixed( 1 ) == targetPosition.x.toFixed( 1 )
        && cursorPosition.y.toFixed( 1 ) == targetPosition.y.toFixed( 1 )
      ) {
      index++;
    }
  };

  var interval = 0;
  var index = 0;
  board.repl.inject({
    servos: servos,
    step: step,
    calculateAngles: DoubleArm.calculateAngles,
    start: function() {
      setInterval( step, 50 );
    },
    stop: function() {
      clearInterval( interval );
    }
  });
  
});