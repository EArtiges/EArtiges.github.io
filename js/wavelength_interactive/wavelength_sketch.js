// Daniel Shiffman
// https://www.kadenze.com/courses/the-nature-of-code
// http://natureofcode.com/
// Session 3: Flow grid Following
// Via Reynolds: http://www.red3d.com/cwr/steer/FlowFollow.html

let wavelength_sketch = function (wvl,n_rows,n_cols) {

  // wvlgrid object
  var wvlgrid;

  wvl.setup = function(){

    const canvas = wvl.createCanvas(320,320);
    canvas.addClass('p5-animation');
    // Make a new wvlgrid
    canvas.parent('wvl-sketch');
    wvl_slider = wvl.createSlider(0, 10, 2, 1).parent('wvl-slider');

    // Make a new flow grid with "resolution" of 16
    wvlgrid = new WaveGrid(10, wvl_slider, wvl);

    wvl_conditions_button = wvl.createButton(wvlgrid.conditions).parent('wvl-conditions-button');
    wvl_conditions_button.addClass("p5-button")
    wvl_conditions_button.mouseClicked(wvl.change_conditions);
    wvl.frameRate(3);
  }

  wvl.draw = function(){
    wvl.clear();
    // Display the wvlgrid in "debug" mode
    wvlgrid.update();
    wvlgrid.display();
  }

  wvl.new_conditions_button = function(button_text){
    wvl_conditions_button.remove();
    wvl_conditions_button = wvl.createButton(button_text).parent('wvl-conditions-button');
    wvl_conditions_button.addClass("p5-button");
    wvl_conditions_button.mouseClicked(wvl.change_conditions);
  }

  wvl.change_conditions = function(){
    if(wvlgrid.conditions=="Dirichlet"){
      wvlgrid.conditions="Neumann";
    }
    else{
      wvlgrid.conditions="Dirichlet";
    };
    wvl.new_conditions_button(wvlgrid.conditions);
  };


}

let wv_p5 = new p5(wavelength_sketch);
