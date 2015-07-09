var five = require("johnny-five"),
  board = new five.Board(),
  SimpleArm = require("../lib/simplearm").SimpleArm,
  ArmUtils = require("../lib/simplearm").ArmUtils;

board.on("ready", function() {
  servos = {
    servo1: five.Servo(9),
    servo2: five.Servo(3)
  };
  servos.servo1.center();
  servos.servo2.center();

  var origin = { x: 0, y: 0 };
  var origin2 = { x: 18, y: 0 };


  var points = [
    { x: 1, y: 15 },
    { x: 10, y: 15 },
    { x: 10, y: 5 },
    { x: 1, y: 5 }
  ];
  var targetPosition = points[ 0 ];
  var cursorPosition = points[ 0 ];

  var arm = new SimpleArm({
    segmentSize1: 17,
    segmentSize2: 17
  });
  var arm2 = new SimpleArm({
    segmentSize1: 17,
    segmentSize2: 17
  });

  var move = function( current, target ) {
    return {
      x: ArmUtils.lerp( current.x, target.x, 0.2 ),
      y: ArmUtils.lerp( current.y, target.y, 0.2 )
    };
  };

  var step = 0;
  var index = 0;
  board.repl.inject({
    servos: servos,
    start: function() {

      step = setInterval( function() {
        // Get a point
        targetPosition = points[ index % points.length ];

        // Iterate untill the 
        cursorPosition = move( cursorPosition, targetPosition );

        var angles = arm.calculateAngles( 
          Math.abs( cursorPosition.x - origin.x ), 
          Math.abs( cursorPosition.y - origin.y )
        );
        var angles2 = arm2.calculateAngles( 
          Math.abs( cursorPosition.x - origin2.x ), 
          Math.abs( cursorPosition.y - origin2.y )
        );

        servos.servo1.to( ArmUtils.toDegrees( angles.angle1 ) );
        servos.servo2.to( ArmUtils.toDegrees( angles2.angle1 ) );

        if(
            cursorPosition.x.toFixed( 1 ) == targetPosition.x.toFixed( 1 )
            && cursorPosition.y.toFixed( 1 ) == targetPosition.y.toFixed( 1 )
          ) {
          index++;
        }
      }, 50);

    },
    stop: function() {
      clearInterval( step );
    }
  });

  step = setInterval( function() {
    // Get a point
    targetPosition = points[ index % points.length ];

    // Iterate untill the 
    cursorPosition = move( cursorPosition, targetPosition );

    var angles = arm.calculateAngles( 
      Math.abs( cursorPosition.x - origin.x ), 
      Math.abs( cursorPosition.y - origin.y )
    );
    var angles2 = arm2.calculateAngles( 
      Math.abs( cursorPosition.x - origin2.x ), 
      Math.abs( cursorPosition.y - origin2.y )
    );

    servos.servo1.to( ArmUtils.toDegrees( angles.angle1 ) );
    servos.servo2.to( ArmUtils.toDegrees( angles2.angle1 ) );

    if(
        cursorPosition.x.toFixed( 1 ) == targetPosition.x.toFixed( 1 )
        && cursorPosition.y.toFixed( 1 ) == targetPosition.y.toFixed( 1 )
      ) {
      index++;
    }
  }, 20);

  // setInterval(function() {
  //   var dx = parseInt( Math.random() * 9 );
  //   var dy = parseInt( Math.random() * 9 );
  //   points = [
  //     { x: 1, y: 5 + dy },
  //     { x: 1 + dx, y: 5 + dy },
  //     { x: 1 + dx, y: 5 },
  //     { x: 1, y: 5 }
  //   ];
  //   console.log( dx, dy, points );
  // }, 10000 );
  
});