// Daniel Shiffman
// https://www.kadenze.com/courses/the-nature-of-code
// http://natureofcode.com/
// Session 3: Flow Field Following
// Via Reynolds: http://www.red3d.com/cwr/steer/FlowFollow.html

let flowfield_sketch = function (p) {

  // Flowfield object
  var flowfield;

  p.setup = function(){

    const canvas = p.createCanvas(400, 400);
    canvas.addClass('p5-animation');
    // Make a new flowfield
    canvas.parent('heatdiff-sketch');
    // Make a new flow field with "resolution" of 16
    flowfield = new FlowField(10, p);
    canvas.mouseClicked(function(){
      flowfield.clicked(p.mouseX, p.mouseY)
    })
  }

  p.draw = function(){
    p.clear();
    // Display the flowfield in "debug" mode
    flowfield.update();
    flowfield.display();
  }

  p.flowfield_init = function() {
      flowfield.init();
  }
}

let field_p5 = new p5(flowfield_sketch);
