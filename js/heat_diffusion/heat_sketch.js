// Daniel Shiffman
// https://www.kadenze.com/courses/the-nature-of-code
// http://natureofcode.com/
// Session 3: Flow grid Following
// Via Reynolds: http://www.red3d.com/cwr/steer/FlowFollow.html

let heatgrid_sketch = function (p,n_rows,n_cols) {

  // heatgrid object
  var heatgrid;

  p.setup = function(){

    const canvas = p.createCanvas(320,320);
    canvas.addClass('p5-animation');
    // Make a new heatgrid
    canvas.parent('heatdiff-sketch');
    // Make a new flow grid with "resolution" of 16
    heatgrid = new HeatGrid(20, p);
    canvas.mouseClicked(function(){
      heatgrid.clicked(p.mouseX, p.mouseY)
    })

    conditions_button = p.createButton(heatgrid.conditions).parent('conditions-button');
    conditions_button.addClass("p5-button")
    conditions_button.mouseClicked(p.change_conditions);
    p.frameRate(24);
  }

  p.draw = function(){
    p.clear();
    // Display the heatgrid in "debug" mode
    heatgrid.update();
    heatgrid.display();
  }

  p.new_conditions_button = function(button_text){
    conditions_button.remove();
    conditions_button = p.createButton(button_text).parent('conditions-button');
    conditions_button.addClass("p5-button");
    conditions_button.mouseClicked(p.change_conditions);
  }

  p.change_conditions = function(){
    if(heatgrid.conditions=="Dirichlet"){
      heatgrid.conditions="Neumann";
    }
    else{
      heatgrid.conditions="Dirichlet";
    };
    p.new_conditions_button(heatgrid.conditions);
  };


}

let grid_p5 = new p5(heatgrid_sketch);
