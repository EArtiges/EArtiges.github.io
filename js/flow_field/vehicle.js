// Daniel Shiffman
// https://www.kadenze.com/courses/the-nature-of-code
// http://natureofcode.com/
// Session 3: Flow Field Following

// The "Vehicle" constructor

function Vehicle(x,y,ms,mf,p) {
  this.position = p.createVector(x,y);
  this.acceleration = p.createVector(0,0);
  this.velocity = p.createVector(0,0);
  this.r = 4;
  this.maxspeed = ms || 4;
  this.maxforce = mf || 0.1;

  this.run = function() {
    this.update();
    this.borders();
    this.display();
  }

  // Implementing Reynolds' flow field following algorithm
  // http://www.red3d.com/cwr/steer/FlowFollow.html
  this.follow = function(flow) {
    // What is the vector at that spot in the flow field?
    var desired = flow.lookup(this.position);
    // Scale it up by maxspeed
    desired.mult(this.maxspeed);
    // Steering is desired minus velocity
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);  // Limit to maximum steering force
    this.applyForce(steer);
  }

  this.applyForce = function(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  }

    // Method to update location
  this.update = function() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  }

  // Wraparound
  this.borders = function() {
    if (this.position.x < -this.r) this.position.x = p.width+this.r;
    if (this.position.y < -this.r) this.position.y = p.height+this.r;
    if (this.position.x > p.width+this.r) this.position.x = -this.r;
    if (this.position.y > p.height+this.r) this.position.y = -this.r;
  }

  this.display = function() {
    // Draw a triangle rotated in the direction of velocity
    var theta = this.velocity.heading() + p.PI/2;
    p.fill(127);
    p.stroke(200);
    p.strokeWeight(1);
    p.push();
    p.translate(this.position.x,this.position.y);
    p.rotate(theta);
    p.beginShape();
    p.vertex(0, -this.r*2);
    p.vertex(-this.r, this.r*2);
    p.vertex(this.r, this.r*2);
    p.endShape(p.CLOSE);
    p.pop();
  }
}