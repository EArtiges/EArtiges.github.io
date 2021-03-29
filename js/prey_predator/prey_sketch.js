// Daniel Shiffman
// https://www.kadenze.com/courses/the-nature-of-code
// http://natureofcode.com/
// Session 3: Flow grid Following
// Via Reynolds: http://www.red3d.com/cwr/steer/FlowFollow.html

let preypred_sketch = function (p5_prey,n_rows,n_cols) {

  // pp_grid object
  var pp_grid;

  let field_anim = false;
  p5_prey.noLoop();

  p5_prey.setup = function(){

    const canvas = p5_prey.createCanvas(320,400);
    canvas.addClass('p5-animation');
    // Make a new pp_grid
    canvas.parent('prey-sketch');
    // Make a new flow grid with "resolution" of 16
    pp_grid = new PreyPredGrid(10, p5_prey);
    canvas.mouseClicked(function(){
      pp_grid.init_sim(p5_prey.mouseX, p5_prey.mouseY);
    })
    // Change the boundary conditions
    p5_prey.conditions_button = p5_prey.createButton(pp_grid.conditions).parent('prey-conditions-button');
    p5_prey.conditions_button.mouseClicked(p5_prey.change_conditions);
    // Play or pause the animation
    p5_prey.stop_button = p5_prey.createButton('Play / Pause').parent('prey-stop-button');
    p5_prey.stop_button.mouseClicked(function(){
      if (field_anim) {
            p5_prey.noLoop()
            field_anim = false;
            }
          else {
            p5_prey.loop()
           field_anim = true;
         } });
       // Wipe all life. Clean start. #Thanos
       p5_prey.reset_button = p5_prey.createButton('Reset grid').parent('prey-reset-button');
       p5_prey.reset_button.mouseClicked(function(){
               pp_grid = new PreyPredGrid(10, p5_prey);
               p5_prey.new_conditions_button(pp_grid.conditions);
             });

//    p5_prey.frameRate(24);
  }

  p5_prey.draw = function(){
    p5_prey.clear();
    // Display the pp_grid in "debug" mode
    for (var iter = 0; iter < 10; iter++) {
      pp_grid.update();
    }
    pp_grid.display();
  }

    p5_prey.new_conditions_button = function(button_text){
    p5_prey.conditions_button.remove();
    p5_prey.conditions_button = p5_prey.createButton(button_text).parent('prey-conditions-button');
    p5_prey.conditions_button.mouseClicked(p5_prey.change_conditions);
  }

  p5_prey.change_conditions = function(){
    if(pp_grid.conditions=="Dirichlet"){
      pp_grid.conditions="Neumann";
    }
    else{
      pp_grid.conditions="Dirichlet";
    };
    p5_prey.new_conditions_button(pp_grid.conditions);
  };

}

let preypredator_p5 = new p5(preypred_sketch);
