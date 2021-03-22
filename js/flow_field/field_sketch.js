// Daniel Shiffman
// https://www.kadenze.com/courses/the-nature-of-code
// http://natureofcode.com/
// Session 3: Flow Field Following
// Via Reynolds: http://www.red3d.com/cwr/steer/FlowFollow.html

let flowfield_sketch = function (p) {

  // Using this variable to decide whether to draw all the stuff
  var debug = true;
  // Flowfield object
  var flowfield;
  // An ArrayList of vehicles
  var vehicles = [];

  let field_anim = false;
  p.noLoop();

  p.setup = function(){

    const canvas = p.createCanvas(640, 360);
    canvas.addClass('p5-animation');
    // Make a new flowfield
    canvas.parent('flowfield-sketch');
    // Make a new flow field with "resolution" of 16
    flowfield = new FlowField(20, p);
    canvas.mouseClicked(function() {
      if (field_anim) {
            p.noLoop()
            field_anim = false;
            }
          else {
            p.loop()
           field_anim = true;
         } })
    // Make a whole bunch of vehicles with random maxspeed and maxforce values
    for (var i = 0; i < 10; i++) {
      vehicles.push(new Vehicle(p.random(p.width), p.random(p.height), p.random(2, 5), p.random(0.1, 0.5), p));
    }
  }

  p.draw = function(){
    p.clear();
    // Display the flowfield in "debug" mode
    if (debug) flowfield.display();
    // Tell all the vehicles to follow the flow field
    for (var i = 0; i < vehicles.length; i++) {
      vehicles[i].follow(flowfield);
      vehicles[i].run();
    }

  }

  p.keyPressed = function() {
    if (p.key == 'A') {
      debug = !debug;
    }
    if (p.key == 'Z') {
      p.flowfield_init()
    }
  }

  p.flowfield_init = function() {
      flowfield.init();
  }
}

let field_p5 = new p5(flowfield_sketch);
