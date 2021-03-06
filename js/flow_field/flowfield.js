// Daniel Shiffman
// https://www.kadenze.com/courses/the-nature-of-code
// http://natureofcode.com/
// Session 3: Flow Field Following

function FlowField(r, p) {
  // How large is each "cell" of the flow field
  this.resolution = r;
  // Determine the number of columns and rows based on sketch's width and height
  this.cols = p.width / this.resolution + 1;
  this.rows = p.height / this.resolution + 1;
  // A flow field is a two dimensional array of p5.Vectors
  // We can't make 2D arrays, but this is sort of faking it
  this.make2Darray = function(n) {
    var array = [];
    for (var i = 0; i < n; i++) {
      array[i] = [];
    }
    return array;
  };
  this.field = this.make2Darray(this.cols);

  this.init = function() {
    // Reseed noise so we get a new flow field every time
    // Need to get noise working
    p.noiseSeed(Math.floor(p.random(10000)));
    var xoff = 0;
    for (var i = 0; i < this.cols; i++) {
      var yoff = 0;
      for (var j = 0; j < this.rows; j++) {
        var theta = p.map(p.noise(xoff, yoff), 0, 1, 0, p.TWO_PI);
        //var theta = map(sin(xoff)+cos(yoff),-2,2,0,TWO_PI);
        // Polar to cartesian coordinate transformation to get x and y components of the vector
        this.field[i][j] = p.createVector(p.cos(theta), p.sin(theta));
        yoff += 0.1;
      }
      xoff += 0.1;
    }
  };
  this.init();

  // Draw every vector
  this.display = function() {
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {
        drawVector(this.field[i][j], i * this.resolution, j * this.resolution, this.resolution - 2);
      }
    }
  };

  this.lookup = function(lookup) {
    var column = Math.floor(p.constrain(lookup.x / this.resolution, 0, this.cols - 1));
    var row = Math.floor(p.constrain(lookup.y / this.resolution, 0, this.rows - 1));
    //println(lookup.x);
    return this.field[column][row].copy();
  };

  // Renders a vector object 'v' as an arrow and a location 'x,y'
  var drawVector = function(v, x, y, scayl) {
    p.push();
    var arrowsize = 4;
    // Translate to location to render vector
    p.translate(x, y);
    p.stroke(200, 100);
    // Call vector heading function to get direction (note that pointing to the right is a heading of 0) and rotate
    p.rotate(v.heading());
    // Calculate length of vector & scale it to be bigger or smaller if necessary
    var len = v.mag() * scayl;
    // Draw three lines to make an arrow (draw pointing up since we've rotate to the proper direction)
    p.line(0, 0, len, 0);
    //line(len,0,len-arrowsize,+arrowsize/2);
    //line(len,0,len-arrowsize,-arrowsize/2);
    p.pop();
  };
}
