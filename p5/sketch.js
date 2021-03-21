// Daniel Shiffman
// https://www.kadenze.com/courses/the-nature-of-code
// http://natureofcode.com/
// Session 1: Walker accelerating towards mouse

var w;

function setup() {
  const canvas = createCanvas(640, 360);
  canvas.parent('sketch-holder')
  // Make a Walker object
  w = new Walker();
}

function draw() {
  // Update and display object
  clear()
  w.update();
  w.display();
}

function Walker() {

  // Start Walker in center
  this.pos = createVector(width/2, height/2);
  // Start with 0 velocity
  this.vel = createVector(0, 0);

  this.friction = 2

  this.update = function() {
    // Vector at mouse location
    var mouse = createVector(mouseX, mouseY);
    // Vector pointing from Walker to mouse
    this.acc = p5.Vector.sub(mouse, this.pos);
    // Setting the magnitude of that vector
    this.acc.setMag(.02*this.acc.mag());

    // Physics engine algorithm
    this.vel.add(this.acc);
    this.vel.setMag(min(10, this.vel.mag()));
    this.pos.add(this.vel);
    this.pos.set([min(max(0, this.pos.x), width), min(max(0, this.pos.y), height)]);

  }

  this.display = function() {
    // Draw Walker as circle
    fill(255);
    ellipse(this.pos.x, this.pos.y, 24, 24);
  }
}
