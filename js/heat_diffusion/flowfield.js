// Daniel Shiffman
// https://www.kadenze.com/courses/the-nature-of-code
// http://natureofcode.com/
// Session 3: Flow Field Following

class cell{

  constructor(x,y,r){
    this.size = r;
    this.x = x;
    this.y = y;
    this.temp = 0;
    this.dx=0;
    this.dy=0;
    this.dx2=0;
    this.dy2=0;
  }

  diffuse(dt, alpha){
    this.temp += (this.dx2 + this.dy2) * alpha * dt;
  }

  clicked(delta_T){
    this.temp += delta_T;
  };

  display(p){
    p.fill(250,0,0,this.temp);
    p.rect(this.x * this.size,this.y * this.size, this.size, this.size);
  }

};

function FlowField(r, p) {
  // How large is each "cell" of the flow field
  this.resolution = r;
  // Determine the number of columns and rows based on sketch's width and height
  this.cols = p.width / this.resolution + 1;
  this.rows = p.height / this.resolution + 1;

  this.dt = .1;
  this.alpha = 1;  // up to 10 times dt

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
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {
        this.field[i][j] = new cell(i, j, this.resolution, p);
      }
    }
  };
  this.init();

  this.clicked = function(mouseX, mouseY){
    i = p.floor(mouseX / this.resolution)
    j = p.floor(mouseY / this.resolution)
    this.field[i][j].clicked(1250);
    }

  this.update = function() {

    // compute first space derivative using FTCS scheme
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {

        prev_x = (i - 1) ;
        if (prev_x<0){A=0}
        else{A=this.field[prev_x][j].temp}

        next_x = (i + 1) ;
        if (next_x>=this.cols){B=0}
        else{B=this.field[next_x][j].temp}

        next_y = (j + 1) ;
        if (next_y>=this.rows){C=0}
        else{C=this.field[i][next_y].temp}

        prev_y = (j - 1) ;
        if (prev_y<0){D=0}
        else{D=this.field[i][prev_y].temp}

        this.field[i][j].dx2 = A + B - 2*this.field[i][j].temp ;
        this.field[i][j].dy2 = C + D - 2*this.field[i][j].temp ;
      }
    }

    // diffuse heat
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {
        this.field[i][j].diffuse(this.dt, this.alpha);
      };
    };
  };

  // Draw every vector
  this.display = function() {
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {
        this.field[i][j].display(p);
      }
    }
  };


}
