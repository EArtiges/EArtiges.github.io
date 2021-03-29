// Daniel Shiffman
// https://www.kadenze.com/courses/the-nature-of-code
// http://natureofcode.com/
// Session 3: heat grid Following

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

function HeatGrid(r, p) {
  // How large is each "cell" of the heat grid
  this.resolution = r;
  // Determine the number of columns and rows based on sketch's width and height
  this.cols = p.width / this.resolution + 1;
  this.rows = p.height / this.resolution + 1;
  this.alpha = 1;
  // Von Neumann in 2D states dt/dx2 + dt/dy2 <= 1/(2*alpha). Here dx=dy :
  this.dt = 0.5 * p.pow(this.resolution, 2) / (4 * this.alpha);
  this.conditions = "Dirichlet";
  p.print(this.conditions);

  // A heat grid is a two dimensional array of p5.Vectors
  // We can't make 2D arrays, but this is sort of faking it
  this.make2Darray = function(n) {
    var array = [];
    for (var i = 0; i < n; i++) {
      array[i] = [];
    }
    return array;
  };
  this.grid = this.make2Darray(this.cols);

  this.init = function() {
    // Reseed noise so we get a new heat grid every time
    // Need to get noise working
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {
        this.grid[i][j] = new cell(i, j, this.resolution, p);
      }
    }
  };
  this.init();

  this.clicked = function(mouseX, mouseY){
    i = p.floor(mouseX / this.resolution)
    j = p.floor(mouseY / this.resolution)
    this.grid[i][j].clicked(1250);
    }

  this.Dirichlet_conditions = function(i, j){
    prev_x = (i - 1) ;
    if (prev_x<0){A=0}
    else{A=this.grid[prev_x][j].temp}

    next_x = (i + 1) ;
    if (next_x>=this.cols){B=0}
    else{B=this.grid[next_x][j].temp}

    next_y = (j + 1) ;
    if (next_y>=this.rows){C=0}
    else{C=this.grid[i][next_y].temp}

    prev_y = (j - 1) ;
    if (prev_y<0){D=0}
    else{D=this.grid[i][prev_y].temp}

    return [A,B,C,D]

  }

  this.Neumann_conditions = function(i, j){
    prev_x = (i - 1) ;
    if (prev_x<0){A=this.grid[i][j].temp}
    else{A=this.grid[prev_x][j].temp}

    next_x = (i + 1) ;
    if (next_x>=this.cols){B=this.grid[i][j].temp}
    else{B=this.grid[next_x][j].temp}

    next_y = (j + 1) ;
    if (next_y>=this.rows){C=this.grid[i][j].temp}
    else{C=this.grid[i][next_y].temp}

    prev_y = (j - 1) ;
    if (prev_y<0){D=this.grid[i][j].temp}
    else{D=this.grid[i][prev_y].temp}

    return [A,B,C,D]

  }


  this.update = function() {

    var [A,B,C,D] = [0,0,0,0] ;

    // compute first space derivative using FTCS scheme
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {

        if (this.conditions == "Dirichlet"){
          [A,B,C,D] = this.Dirichlet_conditions(i,j);
        }
        else{
          [A,B,C,D] = this.Neumann_conditions(i,j);
        }

        this.grid[i][j].dx2 = (A + B - 2*this.grid[i][j].temp)/p.pow(this.resolution, 2) ;
        this.grid[i][j].dy2 = (C + D - 2*this.grid[i][j].temp)/p.pow(this.resolution, 2) ;
      }
    }

    // diffuse heat
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {
        this.grid[i][j].diffuse(this.dt, this.alpha);
      };
    };
  };

  // Draw every vector
  this.display = function() {
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {
        this.grid[i][j].display(p);
      }
    }
  };


}
