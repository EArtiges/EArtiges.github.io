// Daniel Shiffman
// https://www.kadenze.com/courses/the-nature-of-code
// http://natureofcode.com/
// Session 3: Flocking

// Demonstration of Craig Reynolds' "Flocking" behavior
// See: http://www.red3d.com/cwr/
// Rules: Cohesion, Separation, Alignment

let flock_sketch = function (flk) {

  var flock;

  var cohesionSlider;
  var separationSlider;
  var alignmentSlider;
  var distanceSlider;

  let flock_anim = false;
  flk.noLoop();

  flk.setup = function() {
    const canvas = flk.createCanvas(320, 400);
    canvas.addClass('p5-animation');
    canvas.parent('flocking-behaviour-sketch');
    canvas.mouseClicked(function(){
        if (flock_anim) {
          flk.noLoop()
          flock_anim = false;
          }
        else {
          flk.loop()
         flock_anim = true;
         }
    })

    cohesionSlider   = flk.createSlider(0, 8, 1, 0.1).parent('cohesion');
    separationSlider = flk.createSlider(0, 8, 1, 0.1).parent('separation');
    alignmentSlider  = flk.createSlider(0, 8, 1, 0.1).parent('alignment');
    distanceSlider  = flk.createSlider(0, 20, 10, 2).parent('distance');

    flock = new Flock();
    // Add an initial set of boids into the system
    for (var i = 0; i < 60; i++) {
      var b = new Boid(i, flk.width/2,flk.height/2, flk, cohesionSlider, separationSlider, alignmentSlider, distanceSlider);
      flock.addBoid(b);
    }
  }

  flk.draw = function() {
    flk.clear();
    flock.run();
  }
}

let flock_p5 = new p5(flock_sketch);
