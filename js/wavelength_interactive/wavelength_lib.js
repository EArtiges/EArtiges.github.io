// Daniel Shiffman
// https://www.kadenze.com/courses/the-nature-of-code
// http://natureofcode.com/
// Session 3: heat grid Following

class wv_cell{

  constructor(x,y,r){
    this.size = r;
    this.x = x;
    this.y = y;
    this.temp = 0;
  }

  display(wvl){
    if(this.temp>0){
      wvl.fill(250,0,0, 250 * this.temp);
    }else{
      wvl.fill(0,125,125, - 250 * this.temp);
    }
    wvl.rect(this.x * this.size,this.y * this.size, this.size, this.size);
  }

};

function WaveGrid(r, n_slider, wvl) {
  // How large is each "cell" of the heat grid
  this.resolution = r;
  // Determine the number of columns and rows based on sketch's width and height
  this.cols = wvl.width / this.resolution;
  this.rows = wvl.height / this.resolution;
  this.conditions = "Dirichlet";
  this.n = n_slider.value();
  wvl.print(this.conditions);

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
        this.grid[i][j] = new wv_cell(i, j, this.resolution, wvl);
      }
    }
  };
  this.init();

  this.update = function() {

    this.n = n_slider.value()

    // compute first space derivative using FTCS scheme
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {

        if (this.conditions == "Dirichlet"){
          this.grid[i][j].temp = wvl.sin(i * this.n * wvl.PI / this.cols)*wvl.sin(j * this.n * wvl.PI / this.cols);
        }
        else{
          this.grid[i][j].temp = wvl.cos(i * this.n * wvl.PI / this.cols)*wvl.cos(j * this.n * wvl.PI / this.cols);
        }
      }
    }
  }

  // Draw every vector
  this.display = function() {
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {
        this.grid[i][j].display(wvl);
      }
    }
  };

}
