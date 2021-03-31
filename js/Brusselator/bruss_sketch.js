// Daniel Shiffman
// https://www.kadenze.com/courses/the-nature-of-code
// http://natureofcode.com/
// Session 3: Flow grid Following
// Via Reynolds: http://www.red3d.com/cwr/steer/FlowFollow.html

let bruss_sketch = function (p5_bruss,n_rows,n_cols) {

  // bruss_grid object
  var bruss_grid;

  let res = 10
  let frame_iteration=0

  p5_bruss.bruss_field_anim = false;
  p5_bruss.noLoop();
  p5_bruss.print("bruss anim in pause")

  p5_bruss.setup = function(){

    const canvas = p5_bruss.createCanvas(res*30,res*30);
    canvas.addClass('p5-animation');
    // Make a new bruss_grid
    canvas.parent('bruss-sketch');
    // Make a new flow grid with "resolution" of 16

    b_slider = p5_bruss.createSlider(-.2, 1, .3, .1).parent('bruss-slider');

    bruss_grid = new BrussGrid(res, p5_bruss, b_slider, "random");
    canvas.mouseClicked(function(){
      if(p5_bruss.bruss_field_anim){
        bruss_grid.init_sim(p5_bruss.mouseX, p5_bruss.mouseY)
      }else{};
    })
    // Change the boundary conditions
    p5_bruss.conditions_button = p5_bruss.createButton(bruss_grid.conditions).parent('bruss-conditions-button');
    p5_bruss.conditions_button.addClass("p5-button")
    p5_bruss.conditions_button.mouseClicked(p5_bruss.change_conditions);

    // Play or pause the animation
    p5_bruss.stop_button = p5_bruss.createButton('Play').parent('bruss-stop-button');
    p5_bruss.stop_button.addClass("p5-button")
    p5_bruss.stop_button.mouseClicked(p5_bruss.play_or_pause);

    // Wipe all life. Clean start. #Thanos
    p5_bruss.H_reset_button = p5_bruss.createButton('H reset').parent('bruss-homoG-reset');
    p5_bruss.H_reset_button.addClass("p5-button")
    p5_bruss.H_reset_button.mouseClicked(function(){
           bruss_grid = new BrussGrid(res, p5_bruss, b_slider, "homogeneous");
           p5_bruss.new_conditions_button(bruss_grid.conditions);
         });

    p5_bruss.R_reset_button = p5_bruss.createButton('R reset').parent('bruss-random-reset');
    p5_bruss.R_reset_button.addClass("p5-button")
    p5_bruss.R_reset_button.mouseClicked(function(){
           bruss_grid = new BrussGrid(res, p5_bruss, b_slider, "random");
           p5_bruss.new_conditions_button(bruss_grid.conditions);
         });


  }

  p5_bruss.draw = function(){
    p5_bruss.clear();
    for ( var iter_frame = 0 ; iter_frame <50 ; iter_frame++){
      bruss_grid.update();
    }
    bruss_grid.display();;
  }

    p5_bruss.new_conditions_button = function(button_text){
    p5_bruss.conditions_button.remove();
    p5_bruss.conditions_button = p5_bruss.createButton(button_text).parent('bruss-conditions-button');
    p5_bruss.conditions_button.addClass("p5-button")
    p5_bruss.conditions_button.mouseClicked(p5_bruss.change_conditions);
  }

  p5_bruss.change_conditions = function(){
    if(bruss_grid.conditions=="Dirichlet"){
      bruss_grid.conditions="Neumann";
    }
    else{
      if(bruss_grid.conditions=="Neumann"){
        bruss_grid.conditions="Periodic";
      }
      else{
      bruss_grid.conditions="Dirichlet";}
    };
    p5_bruss.new_conditions_button(bruss_grid.conditions);
  };

  p5_bruss.play_or_pause = function(){
    if (p5_bruss.bruss_field_anim) {
          p5_bruss.stop_button.remove()
          p5_bruss.stop_button = p5_bruss.createButton('Play').parent('bruss-stop-button');
          p5_bruss.stop_button.addClass("p5-button")
          p5_bruss.stop_button.mouseClicked(p5_bruss.play_or_pause);

          p5_bruss.noLoop()
          p5_bruss.bruss_field_anim = false;
          }
          else{
          p5_bruss.stop_button.remove()
          p5_bruss.stop_button = p5_bruss.createButton('Pause').parent('bruss-stop-button');
          p5_bruss.stop_button.addClass("p5-button")
          p5_bruss.stop_button.mouseClicked(p5_bruss.play_or_pause);

          p5_bruss.loop()
          p5_bruss.bruss_field_anim = true;
       } }


}

let brusselator_p5 = new p5(bruss_sketch);
