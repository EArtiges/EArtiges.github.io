---
layout: post
title:  "Collective behaviour: an introduction to complex systems"
date:   2021-03-21 11:44:13 +0000
categories: complex-systems p5.js  
---

# Following a vector field

Following the [documentation](https://p5js.org/reference/#/p5.Element/mouseClicked) of p5.js, we can alter the source code from [The Nature of Code](https://www.kadenze.com/courses/the-nature-of-code/info): Press `A` to display the vector field, `Z` to initialize a new vector field at random, and click on the canvas to start/stop the animation (the animation must be running for the vector field changes to be displayed).

<div id="flowfield-sketch" style="text-align: center;"></div>
<script src="{{"js/flow_field/libraries/p5.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"js/flow_field/libraries/p5.dom.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"js/flow_field/libraries/p5.sound.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"js/flow_field/flowfield.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"js/flow_field/vehicle.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"js/flow_field/field_sketch.js" | relative_url}}" type="text/javascript"></script>



# Reynolds and the flocking models

In the same way, as an introduction to complex systems, you can play with some parameters of Reynold's flocking behavior in the animation below. Click on the canvas to start/stop the animation.

<div id="flocking-behavior-sketch" style="text-align: center;">

<section style="display: grid; grid-template-columns: 1fr 1fr 1fr;">
<div id = "separation">
<b> Separation </b>
</div>
<div id = "alignment">
<b> Alignment </b>
</div>
<div id = "cohesion">
<b> Cohesion </b>
</div>
</section>

</div>
<script src="{{"js/flocking_behavior/libraries/p5.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"js/flocking_behavior/libraries/p5.dom.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"js/flocking_behavior/libraries/p5.sound.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"js/flocking_behavior/boid.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"js/flocking_behavior/flock.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"js/flocking_behavior/flock_sketch.js" | relative_url}}" type="text/javascript"></script>
