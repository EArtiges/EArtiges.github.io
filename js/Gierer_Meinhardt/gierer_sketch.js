// Daniel Shiffman
// https://www.kadenze.com/courses/the-nature-of-code
// http://natureofcode.com/
// Session 3: Flow grid Following
// Via Reynolds: http://www.red3d.com/cwr/steer/FlowFollow.html

let gierer_sketch = function (p5_gierer,n_rows,n_cols) {

  // gg_grid object
  var gg_grid;

  let res = 10
  let frame_iteration=0

  p5_gierer.gg_field_anim = false;
  p5_gierer.noLoop();
  p5_gierer.print("Gierer anim in pause")

  p5_gierer.setup = function(){

    const canvas = p5_gierer.createCanvas(res*30,res*30);
    canvas.addClass('p5-animation');
    // Make a new gg_grid
    canvas.parent('gierer-sketch');
    // Make a new flow grid with "resolution" of 16

    b_slider = p5_gierer.createSlider(-.2, 1, .3, .1).parent('gierer-slider');

    gg_grid = new GiererGrid(res, p5_gierer, b_slider, "random");
    canvas.mouseClicked(function(){
      if(p5_gierer.gg_field_anim){
        gg_grid.init_sim(p5_gierer.mouseX, p5_gierer.mouseY)
      }else{};
    })
    // Change the boundary conditions
    p5_gierer.conditions_button = p5_gierer.createButton(gg_grid.conditions).parent('gierer-conditions-button');
    p5_gierer.conditions_button.addClass("p5-button")
    p5_gierer.conditions_button.mouseClicked(p5_gierer.change_conditions);

    // Play or pause the animation
    p5_gierer.stop_button = p5_gierer.createButton('Play').parent('gierer-stop-button');
    p5_gierer.stop_button.addClass("p5-button")
    p5_gierer.stop_button.mouseClicked(p5_gierer.play_or_pause);

    // Wipe all life. Clean start. #Thanos
    p5_gierer.H_reset_button = p5_gierer.createButton('H reset').parent('gierer-homoG-reset');
    p5_gierer.H_reset_button.addClass("p5-button")
    p5_gierer.H_reset_button.mouseClicked(function(){
           gg_grid = new GiererGrid(res, p5_gierer, b_slider, "homogeneous");
           p5_gierer.new_conditions_button(gg_grid.conditions);
         });

    p5_gierer.R_reset_button = p5_gierer.createButton('R reset').parent('gierer-random-reset');
    p5_gierer.R_reset_button.addClass("p5-button")
    p5_gierer.R_reset_button.mouseClicked(function(){
           gg_grid = new GiererGrid(res, p5_gierer, b_slider, "random");
           p5_gierer.new_conditions_button(gg_grid.conditions);
         });


  }

  p5_gierer.draw = function(){
    p5_gierer.clear();
    for ( var iter_frame = 0 ; iter_frame <50 ; iter_frame++){
      gg_grid.update();
    }
    gg_grid.display();;
  }

    p5_gierer.new_conditions_button = function(button_text){
    p5_gierer.conditions_button.remove();
    p5_gierer.conditions_button = p5_gierer.createButton(button_text).parent('gierer-conditions-button');
    p5_gierer.conditions_button.addClass("p5-button")
    p5_gierer.conditions_button.mouseClicked(p5_gierer.change_conditions);
  }

  p5_gierer.change_conditions = function(){
    if(gg_grid.conditions=="Dirichlet"){
      gg_grid.conditions="Neumann";
    }
    else{
      if(gg_grid.conditions=="Neumann"){
        gg_grid.conditions="Periodic";
      }
      else{
      gg_grid.conditions="Dirichlet";}
    };
    p5_gierer.new_conditions_button(gg_grid.conditions);
  };

  p5_gierer.play_or_pause = function(){
    if (p5_gierer.gg_field_anim) {
          p5_gierer.stop_button.remove()
          p5_gierer.stop_button = p5_gierer.createButton('Play').parent('gierer-stop-button');
          p5_gierer.stop_button.addClass("p5-button")
          p5_gierer.stop_button.mouseClicked(p5_gierer.play_or_pause);

          p5_gierer.noLoop()
          p5_gierer.gg_field_anim = false;
          }
          else{
          p5_gierer.stop_button.remove()
          p5_gierer.stop_button = p5_gierer.createButton('Pause').parent('gierer-stop-button');
          p5_gierer.stop_button.addClass("p5-button")
          p5_gierer.stop_button.mouseClicked(p5_gierer.play_or_pause);

          p5_gierer.loop()
          p5_gierer.gg_field_anim = true;
       } }


}

let gierer_meinhardt_p5 = new p5(gierer_sketch);
