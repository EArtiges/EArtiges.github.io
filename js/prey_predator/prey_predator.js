// Daniel Shiffman
// https://www.kadenze.com/courses/the-nature-of-code
// http://natureofcode.com/
// Session 3: heat grid Following

class pp_cell{

  constructor(x,y,r){
    this.size = r;
    this.x = x;
    this.y = y;

    this.prey=1;
    this.prey_dx=0;
    this.prey_dy=0;
    this.prey_laplacian=0;

    this.predator = 0;
    this.predator_dx=0;
    this.predator_dy=0;
    this.predator_laplacian=0;
  }

  diffuse(dt_prey, alpha_prey, dt_predator, alpha_predator, p5_prey){
    let kill = .062
    let feed = .055
    this.prey += ( this.prey_laplacian * alpha_prey - this.prey*p5_prey.pow(this.predator,2) + feed * (1 - this.prey) ) * dt_prey;
    this.predator += ( this.predator_laplacian * alpha_predator + this.prey*p5_prey.pow(this.predator,2) - (kill + feed )*this.predator) * dt_predator;

    if (this.prey>1){
      this.prey=1;
    }else{};
    if (this.predator>1){
      this.predator=1;
    }else{};
    if (this.prey<0){
      this.prey=0;
    }else{};
    if (this.predator<0){
      this.predator=0;
    }else{};

  }

  display(p5_prey){
    p5_prey.fill(252,191,73, 500 * this.predator)
    p5_prey.rect(this.x * this.size,this.y * this.size, this.size, this.size);
  }

};

function PreyPredGrid(r, p5_prey) {
  // How large is each "pp_cell" of the heat grid
  this.resolution = r;
  // Determine the number of columns and rows based on sketch's width and height
  this.cols = p5_prey.width / this.resolution + 1;
  this.rows = p5_prey.height / this.resolution + 1;
  this.alpha_prey = 1;
  this.alpha_predator = 0.5;
  // Von Neumann in 2D states dt/dx2 + dt/dy2 <= 1/(2*alpha). Here dx=dy :
  this.dt_prey = 1 // p5_prey.pow(this.resolution, 2) // (4 * this.alpha_prey);
  this.dt_predator = 1 //p5_prey.pow(this.resolution, 2) // (4 * this.alpha_predator);
  this.conditions = "Dirichlet";
  p5_prey.print(this.conditions);

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
        this.grid[i][j] = new pp_cell(i, j, this.resolution, p5_prey);
      }
    }
  };
  this.init();

  this.init_sim = function(mouseX, mouseY){
    i = p5_prey.floor(mouseX / this.resolution)
    j = p5_prey.floor(mouseY / this.resolution)
    this.grid[i][j].predator = 1;
    this.grid[i+1][j].predator = 1;
    this.grid[i][j+1].predator = 1;
    }

  this.boundary_conditions = function(i, j, fill_in_prey,fill_in_predator){
    // left nghb
    prev_x = (i - 1) ;
    no_left = prev_x<0;
    if (no_left){
      A_prey=fill_in_prey
      A_predator=fill_in_predator}
    else{
      A_prey=this.grid[prev_x][j].prey
      A_predator=this.grid[prev_x][j].predator}

    // right nghb
    next_x = (i + 1) ;
    no_right = next_x>=this.cols;
    if (no_right){
      B_prey=fill_in_prey
      B_predator=fill_in_predator}
    else{
      B_prey=this.grid[next_x][j].prey
      B_predator=this.grid[next_x][j].predator}

    // below nghb
    next_y = (j + 1) ;
    no_low = next_y>=this.rows;
    if (no_low){
      C_prey=fill_in_prey
      C_predator=fill_in_predator}
    else{
      C_prey=this.grid[i][next_y].prey
      C_predator=this.grid[i][next_y].predator
    }

    // up nghb
    prev_y = (j - 1) ;
    no_up = prev_y<0;
    if (no_up){
      D_prey=fill_in_prey
      D_predator=fill_in_predator}
    else{
      D_prey=this.grid[i][prev_y].prey
      D_predator=this.grid[i][prev_y].predator}

    // up right nghb
    if (no_up || no_right){
      E_prey=fill_in_prey
      E_predator=fill_in_predator}
    else{
      E_prey=this.grid[next_x][prev_y].prey
      E_predator=this.grid[next_x][prev_y].predator}

    // up left nghb
    if (no_up || no_left){
      F_prey=fill_in_prey
      F_predator=fill_in_predator}
    else{
      F_prey=this.grid[prev_x][prev_y].prey
      F_predator=this.grid[prev_x][prev_y].predator}

    // low right nghb
    if (no_low || no_right){
      G_prey=fill_in_prey
      G_predator=fill_in_predator}
    else{
      G_prey=this.grid[next_x][next_y].prey
      G_predator=this.grid[next_x][next_y].predator}

    // low left nghb
    if (no_low || no_left){
      H_prey=fill_in_prey
      H_predator=fill_in_predator}
    else{
      H_prey=this.grid[prev_x][next_y].prey
      H_predator=this.grid[prev_x][next_y].predator}

    var adj_ngh_prey = A_prey + B_prey + C_prey + D_prey
    var adj_ngh_predator = A_predator + B_predator + C_predator + D_predator
    var diag_ngh_prey = E_prey + F_prey + G_prey + H_prey
    var diag_ngh_predator = E_predator + F_predator + G_predator + H_predator

    return [adj_ngh_prey,adj_ngh_predator,diag_ngh_prey,diag_ngh_predator]

  }

  this.update = function() {

    var [adj_ngh_prey,adj_ngh_predator,diag_ngh_prey,diag_ngh_predator] = [0,0,0,0]

    // compute Laplacian using FTCS scheme
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {

        if (this.conditions == "Dirichlet"){
          // fill in values are 0: the cell outside is empty, so preys and predator can diffuse outside freely
          [adj_ngh_prey,adj_ngh_predator,diag_ngh_prey,diag_ngh_predator] = this.boundary_conditions(i,j, 0, 0);
        }
        else{
          // fill in values are identical to border cells: the cell outside is the same as the cell inside. first derivatives are null
          [adj_ngh_prey,adj_ngh_predator,diag_ngh_prey,diag_ngh_predator] = this.boundary_conditions(i,j, this.grid[i][j].prey, this.grid[i][j].predator);
        }

        this.grid[i][j].prey_laplacian = (.2*adj_ngh_prey + .05*diag_ngh_prey - this.grid[i][j].prey) // p5_prey.pow(this.resolution, 2) ;
        this.grid[i][j].predator_laplacian = (.2*adj_ngh_predator + .05*diag_ngh_predator - this.grid[i][j].predator) // p5_prey.pow(this.resolution, 2) ;

      }
    }

    // diffuse heat
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {
        this.grid[i][j].diffuse(this.dt_prey, this.alpha_prey, this.dt_predator, this.alpha_predator, p5_prey);
      };
    };
  };

  // Draw every vector
  this.display = function() {
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {
        this.grid[i][j].display(p5_prey);
      }
    }
  };

}
