// Daniel Shiffman
// https://www.kadenze.com/courses/the-nature-of-code
// http://natureofcode.com/
// Session 3: heat grid Following

class bruss_cell{

  constructor(x,y,r,a,b,dt){
    this.size = r;
    this.x = x;
    this.y = y;
    this.b=b;
    this.a=a;

    this.u = this.a;
    this.u_dx=0;
    this.u_dy=0;
    this.u_laplacian=0;

    this.v = this.b/this.a;
    this.v_dx=0;
    this.v_dy=0;
    this.v_laplacian=0;

    this.dt=dt
    this.fill_alph_value = 0

  }

  diffuse(dx, alpha_u, alpha_v, p5_bruss){
    this.u += this.dt*(this.u_laplacian * alpha_u + this.a + p5_bruss.pow(this.u, 2)*this.v - (this.b+1)*this.u );
    this.v += this.dt*(this.v_laplacian * alpha_v + this.b*this.u - p5_bruss.pow(this.u, 2)*this.v);

    if (this.v < 0){this.v = 0}else{}
    if (this.u < 0){this.u = 0}else{}
  }

  display(p5_bruss){
    if(this.v>0 || this.u>0){
      this.fill_alph_value = .5*(this.v-this.u)/(this.v+this.u)
    }else{
      this.fill_alph_value = 0}

    p5_bruss.fill(252,191,73, 125 + 240 * (this.fill_alph_value) )
    p5_bruss.rect(this.x * this.size,this.y * this.size, this.size, this.size);
//    p5_bruss.ellipse( (this.x +.5)*this.size ,(this.y +.5)*this.size, this.size, this.size);

  }

};

function BrussGrid(r, p5_bruss, b_slider, init_conditions) {

// model parameters
  this.a=4.5;
  this.alpha_u = 1;
  this.alpha_v = 8;
  this.eta = p5_bruss.pow(1/this.alpha_v, 0.5)
  this.b_c = p5_bruss.pow( 1 + this.a*this.eta, 2)
  this.b = (b_slider.value() + 1)*this.b_c
  p5_bruss.print("initial b value: " + this.b)

  // How large is each "bruss_cell" of the heat grid
  this.resolution = r;
  // Determine the number of columns and rows based on sketch's width and height
  this.cols = p5_bruss.width / this.resolution;
  this.rows = p5_bruss.height / this.resolution;
  // Von Neumann in 2D states dt/dx2 + dt/dy2 <= 1/(2*alpha). Here dx=dy : dt <= dx2 / alpha
  this.dx =  3 * p5_bruss.PI/this.cols ;
  this.dt = p5_bruss.pow(this.dx, 2) / (4 * (this.alpha_v + this.alpha_u));
  this.init_conditions=init_conditions
  p5_bruss.print("initial conditions: "+this.init_conditions);
  this.conditions = "Periodic";
  p5_bruss.print("initial BC conditions: "+this.conditions);

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
        if(this.init_conditions=="homogeneous"){
        this.grid[i][j] = new bruss_cell(i, j, this.resolution, this.a, this.b, this.dt);
      }else{
        this.grid[i][j] = new bruss_cell(i, j, this.resolution, this.a + p5_bruss.random(-1,1), this.b+p5_bruss.random(-1,1), this.dt);
      }

      }
    }
    p5_bruss.print("initial v concentration: "+this.grid[0][0].v)

  };
  this.init();

  this.init_sim = function(mouseX, mouseY){
    i = p5_bruss.floor(mouseX / this.resolution)
    j = p5_bruss.floor(mouseY / this.resolution)
    this.grid[i][j].v += 10;
    this.grid[i][j+1].v += 10;
    this.grid[i+1][j].v += 10;

    }

  this.boundary_conditions = function(i, j, fill_in_u,fill_in_v){
    // left nghb
    prev_x = (i - 1) ;
    no_left = prev_x<0;
    if (no_left){
      A_u=fill_in_u
      A_v=fill_in_v}
    else{
      A_u=this.grid[prev_x][j].u
      A_v=this.grid[prev_x][j].v}

    // right nghb
    next_x = (i + 1) ;
    no_right = next_x>=this.cols;
    if (no_right){
      B_u=fill_in_u
      B_v=fill_in_v}
    else{
      B_u=this.grid[next_x][j].u
      B_v=this.grid[next_x][j].v}

    // below nghb
    next_y = (j + 1) ;
    no_low = next_y>=this.rows;
    if (no_low){
      C_u=fill_in_u
      C_v=fill_in_v}
    else{
      C_u=this.grid[i][next_y].u
      C_v=this.grid[i][next_y].v
    }

    // up nghb
    prev_y = (j - 1) ;
    no_up = prev_y<0;
    if (no_up){
      D_u=fill_in_u
      D_v=fill_in_v}
    else{
      D_u=this.grid[i][prev_y].u
      D_v=this.grid[i][prev_y].v}

    // up right nghb
    if (no_up || no_right){
      E_u=fill_in_u
      E_v=fill_in_v}
    else{
      E_u=this.grid[next_x][prev_y].u
      E_v=this.grid[next_x][prev_y].v}

    // up left nghb
    if (no_up || no_left){
      F_u=fill_in_u
      F_v=fill_in_v}
    else{
      F_u=this.grid[prev_x][prev_y].u
      F_v=this.grid[prev_x][prev_y].v}

    // low right nghb
    if (no_low || no_right){
      G_u=fill_in_u
      G_v=fill_in_v}
    else{
      G_u=this.grid[next_x][next_y].u
      G_v=this.grid[next_x][next_y].v}

    // low left nghb
    if (no_low || no_left){
      H_u=fill_in_u
      H_v=fill_in_v}
    else{
      H_u=this.grid[prev_x][next_y].u
      H_v=this.grid[prev_x][next_y].v}

    var adj_ngh_u = A_u + B_u + C_u + D_u
    var adj_ngh_v = A_v + B_v + C_v + D_v
    var diag_ngh_u = E_u + F_u + G_u + H_u
    var diag_ngh_v = E_v + F_v + G_v + H_v

    return [adj_ngh_u,adj_ngh_v,diag_ngh_u,diag_ngh_v]

  }

  this.periodic_boundary_conditions = function(i, j){
    // left nghb
    prev_x = (i - 1) ;
    no_left = prev_x<0;
    if (no_left){
      A_u=this.grid[this.cols-1][j].u
      A_v=this.grid[this.cols-1][j].v}
    else{
      A_u=this.grid[prev_x][j].u
      A_v=this.grid[prev_x][j].v}

    // right nghb
    next_x = (i + 1) ;
    no_right = next_x>=this.cols;
    if (no_right){
      B_u=this.grid[0][j].u
      B_v=this.grid[0][j].v}
    else{
      B_u=this.grid[next_x][j].u
      B_v=this.grid[next_x][j].v}

    // below nghb
    next_y = (j + 1) ;
    no_low = next_y>=this.rows;
    if (no_low){
      C_u=this.grid[i][0].u
      C_v=this.grid[i][0].v}
    else{
      C_u=this.grid[i][next_y].u
      C_v=this.grid[i][next_y].v
    }

    // up nghb
    prev_y = (j - 1) ;
    no_up = prev_y<0;
    if (no_up){
      D_u=this.grid[i][this.rows-1].u
      D_v=this.grid[i][this.rows-1].v}
    else{
      D_u=this.grid[i][prev_y].u
      D_v=this.grid[i][prev_y].v}

    // up right nghb
    if (no_up || no_right){
      E_u=this.grid[0][this.rows-1].u
      E_v=this.grid[0][this.rows-1].v}
    else{
      E_u=this.grid[next_x][prev_y].u
      E_v=this.grid[next_x][prev_y].v}

    // up left nghb
    if (no_up || no_left){
      F_u=this.grid[this.cols-1][this.rows-1].u
      F_v=this.grid[this.cols-1][this.rows-1].v}
    else{
      F_u=this.grid[prev_x][prev_y].u
      F_v=this.grid[prev_x][prev_y].v}

    // low right nghb
    if (no_low || no_right){
      G_u=this.grid[0][0].u
      G_v=this.grid[0][0].v}
    else{
      G_u=this.grid[next_x][next_y].u
      G_v=this.grid[next_x][next_y].v}

    // low left nghb
    if (no_low || no_left){
      H_u=this.grid[this.cols-1][0].u
      H_v=this.grid[this.cols-1][0].v}
    else{
      H_u=this.grid[prev_x][next_y].u
      H_v=this.grid[prev_x][next_y].v}

    var adj_ngh_u = A_u + B_u + C_u + D_u
    var adj_ngh_v = A_v + B_v + C_v + D_v
    var diag_ngh_u = E_u + F_u + G_u + H_u
    var diag_ngh_v = E_v + F_v + G_v + H_v

    return [adj_ngh_u,adj_ngh_v,diag_ngh_u,diag_ngh_v]

  }

  this.update = function() {

    var [adj_ngh_u,adj_ngh_v,diag_ngh_u,diag_ngh_v] = [0,0,0,0]

    // compute Laplacian using FTCS scheme
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {

        if (this.conditions == "Dirichlet"){
          // fill in values are 0: the cell outside is empty, so us and v can diffuse outside freely
          [adj_ngh_u,adj_ngh_v,diag_ngh_u,diag_ngh_v] = this.boundary_conditions(i,j, 0, 0);}
        else{
            if (this.conditions == "Neumann"){
              // fill in values are identical to border cells: the cell outside is the same as the cell inside so no diffusion allowed.
              [adj_ngh_u,adj_ngh_v,diag_ngh_u,diag_ngh_v] = this.boundary_conditions(i,j, this.grid[i][j].u, this.grid[i][j].v);}
            else{
              [adj_ngh_u,adj_ngh_v,diag_ngh_u,diag_ngh_v] = this.periodic_boundary_conditions(i,j);
                }
            }

        this.grid[i][j].u_laplacian =  (.2*adj_ngh_u + .05*diag_ngh_u - this.grid[i][j].u) / p5_bruss.pow(this.dx, 2);
        this.grid[i][j].v_laplacian =  (.2*adj_ngh_v + .05*diag_ngh_v - this.grid[i][j].v) / p5_bruss.pow(this.dx, 2);

//        this.grid[i][j].u_laplacian =  (.25*adj_ngh_u - this.grid[i][j].u) / p5_bruss.pow(this.dx, 2);
//        this.grid[i][j].v_laplacian =  (.25*adj_ngh_v - this.grid[i][j].v) / p5_bruss.pow(this.dx, 2);


      }
    }

    // diffuse heat
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {
        this.grid[i][j].diffuse(this.dx, this.alpha_u, this.alpha_v, p5_bruss);
      };
    };
  };

  // Draw every vector
  this.display = function() {
    for (var i = 0; i < this.cols; i++) {
      for (var j = 0; j < this.rows; j++) {
        this.grid[i][j].display(p5_bruss);
      }
    }
  };

}
