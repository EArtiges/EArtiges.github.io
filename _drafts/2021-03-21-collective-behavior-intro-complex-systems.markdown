---
layout: post
title:  "Collective behaviour: an introduction to complex systems"
date:   2021-03-21 11:44:13 +0000
categories: complex-systems complexity p5.js  
summary: Where we learn about the New York accent, computer graphics in the late 80s, the autonomy of birds, and where Jeff Goldblum makes a surprise appearance.
---

> #### Why did I write this article?
>* Complex Systems are objectively super cool (that has been scientifically proven like ten thousand times).
>* With an ever-increasing portion of the planet connected to internet, our worldview is now richer and deeper than ever, while remaining thoroughly incomplete. Complex Systems provide us with tools and concepts to address this problem.
>* I wanted to have a first article on my blog, and talking about something that I know seemed like a good place to start.
>* I wanted to put my web programming skills to the test by incorporating some p5.js to a Jekyll bog post.

# Complex Systems: introduction

> To a  Platonic mind, everything in the world is connected with everything else and perhaps it is. Everything is connected, but some things are more connected than others.
> <small> Herbert A. Simon, Nobel Price of Economy </small>

# What is a Complex System?

### A whole greater than the sum of its parts

Complexity Science is a young approach to science studying how the collective behavior of a whole emerges from the relationships between parts. A complex system is composed of many subsystems which interact with one another (e.g social systems formed (in part) out of relationships between people, the brain formed out of neurons, molecules formed out of atoms, the weather formed out of air flows...). Such systems' behaviors are intrinsically difficult to predict due to the interactions between their parts or with its environment. 

Another definition of complex systems arises by the negative: to say that something is complex means that it is not simple. In simple systems, interactions between sub-systems are weak and do not result in surprising interactions at the collective level. Gas molecules follow random trajectories that are relatively independent of one another (shocks between molecules of gas are actually quite rare): the properties of the gas as a whole are quite predictable, it's a simple system.

It is also important to differentiate "complex" from "intricate" systems (in which the system's properties are not emergent but the product of a grand design or a blueprint, like a plane or a computer). Quite the opposite, anthill galleries structures are a typical example of complex system, since it's carried out from the bottom up by worker ants without the coordination of the queen that would have the anthill plans ready.

### A decentralized entity

French mathematician Nino Boccara, about the organization of workers in an ant colony:
> The number of workers engaged in a specific task is appropriate to the current condition. When small piles of mixed seeds are placed outside the nest mound, away from the foraging trails but in front of scouting patrollers, early in the morning, active recruitment of foragers takes place. When toothpicks are placed near the nest entrance, early in the morning at the beginning of nest-maintenance activity, the number of nest-maintenance workers increases significantly.The surprising fact is that task allocation is accomplished without any central control. 
> Each individual ant processes [local information from the ants nearby through chemical and tactile communication] to decide which of the many possible functional roles it should play in the colony.The cooperative behavior of an ant colony that results from local interactions between its members and not from the existence of a central controller is referred to as emergent behavior. Emergent properties are defined as large-scale effects of locally interacting agents that are often surprising and hard to predict even in the case of simple interactions.
> <small> - Nino Boccara </small>

Emergent properties reflect the primordial role of interactions between parts. They are manifested by self-organisation, where order and coherence are ensured by a bottom-up mechanism rather than through a top-down design and control. In the example above, no two ants have the same experience or the same neighbours: their individual trajectories and actions are impossible to predict because they are the results of a myriad of factors and feedback loops. This coexistence of global stability and local disorder raises concern about predictability of a system's evolution. Human systems such as traders in stock markets influencing both each other and the market itself are also confronted to unexpected crises and collapses, despite the rationality supposed to prevail at the individual level.

### A challenge for scientists

In physics, the classical and traditional approach to a system is to put it in equations, and then to obtain a solution by solving these equations (either exactly or approximately). Think of Isaac Newton and the apple: Gravity pulls the apple down, the apple falls down. If I know the initial position of the apple and the laws of physics, I can predict with exactitude where it will land. 

> Easy peasy. 
> <small> - Isaac Newton </small>

Now what if Newton drops a whole bucket of apples on the ground (silly you, Isaac)? Suddenly it's not so straightforward anymore to predict where each apple will land: the apples will tumble down, kick each other as they touch the ground, and keep on ricochet like snooker balls until they finally stop in a corner. Because of the multiple interactions between fruits, the knowledge of the laws of physics and of the initial positions of the apples are not enough for me to tell you the place where each apple will land and stop moving, at least not by solving equations. Answering this problem (and others that fall in the same category) requires scientists to figure out new ways of asking relevant questions.

# Why should we care about Complex Systems?

### Because Complex Systems are everywhere! 

As Herbert A. Simon, American Nobel Price of economy, writes:  <q> We  should expect that [social and technologic] complexity will continue to increase, and this means that organizations will be less and less recognizable as hierarchies. We see this in many ways, even by considering how  informal  distributed  organizations  like  the  open-source  movement  are  challenging innovative but conventional organizations like Microsoft</q>. 

> As  scientists,  we  would  like  to  understand  how  this  self-organizing  process  takes  place. We would like to understand the mechanism by which patterns form. This could lead to a revolution in engineering and in management. [...] Patterns of behavior of human  beings in economic  and  social  systems  also  cannot  be  explained directly  from  external  forces.  External  forces  cannot  explain  fads  of  people  buying products, or price changes in stock markets where prices change dramatically from day to day or even minute to minute. [...] The interactions between people are, however, important in [the creation of these phenomena]. These  are  self-organizing  patterns.  Without  understanding  how  patterns  arise  from  the  interactions inside a system we cannot understand these behaviors.
> <small> - Herbert Simon </small>

Complex systems are also omnipresent in biology and evolutionary processes, mainly because of their inherently hierarchical structure, that provides a fertile ground for a selection process at different levels. Building stable sub-systems and combining them together to make a bigger structure is a much safer and faster evolutionary strategy because it drastically reduces the amount of possible combinations and it builds resilience in a system. 

> A mammal's circulatory system [...] receives oxygen from the respiratory system and nutrients from the digestive system. It delivers these to the muscles from which it receives carbon dioxide, and other wastes. These it delivers, in turn, to lungs and kidneys, and so on. How the circulatory system accomplishes these tasks is of no concern to the other systems, as long as it does accomplish them. Appropriate evolutionary changes may take place in any one of these systems [without] disturbing the others. Natural selection may improve a horse's locomotion without necessarily changing his digestion. 
> <small> - Herbert Simon </small>

Most of Complex Systems found in nature fit in one or more of four intertwined hierarchic sequences:
* From observable chemical substances, which are made of molecules. Within the molecules are found atoms, within the atoms, nuclei and electrons, and within the nuclei, elementary particles. 
* From living organisms to tissues and organs, to cells, to macromolecules, to organic compounds, to a  junction with the molecules of the first hierarchy. 
* From the statistics of inheritance to genes and chromosomes, to DNA. 
* From human or animal societies to organizations, to small groups, to individual living beings, to cognitive programs in the central nervous system, to elementary information processes where the junctions with the tissues and organs of neurobiology largely remain to be discovered.

# How can we study Complex Systems?

We need, in our approach of complex systems, to shift paradigm: instead of a top-down approach like Isaac and the apple, we must at the contrary focus on implementing low-levels rules as close as possible to what we know of reality, and consider the behaviour of the entire system our object of study.

Keep as quote
> Pushing  on  a  complex  system  "here"  often has effects "over there" because the parts are interdependent. This has become more and more  apparent  in  our  efforts  to  solve  societal  problems  or  avoid  ecological  disasters caused  by  our  own  actions. The  field  of  complex  systems  provides  a  number  of sophisticated tools, some of them concepts that help us think about these  systems, some of  them  analytical  for  studying  these  systems  in  greater  depth,  and  some  of  them computer-based for describing, modeling or simulating these systems. 
> <small> - Nino Boccara</small>

Using probabilities is a natural alternative. Since the interactions between subsystems are usually unstable (read: apples kicking each other make a mess), the quantities usually studied by deterministic approaches are now subject to random fluctuations due to these unstable interactions (read: apples from the bucket will fall less straight than the apple from the tree). Therefore the probability distributions of these quantities become now the principal quantities of interest (read: "It will laaaaaand... About here. Best I can do").

Rather than solving a set of equations, using simulations is a standard approach in the study of complex systems. Finding a minimal set of simple, local rules and write a program to see them in action captures complex behaviors with surprising generality: the detailed structure of the subsystems do not need to be known for observed behavior to arise in the simulation (a <a href="https://www.complexity-explorables.org/explorables/a-patchwork-darwinge/", target="_blank"> Darwinian evolution simulation </a> can teach us about mutation selection with a single rule). By providing some control to the user and allowing her to receive direct feedback, computer implementations of these models can provide deep insight on different scenarios.

I would like to demonstrate that here and now.

### Reynolds Boids

* <a href="http://www.red3d.com/cwr/" target="_blank">Craig Reynolds</a> Boids as an example of complex systems
* Reynold's original paper: concepts and ideas
* Reynold's original paper: maths

#### <a href="https://en.wikipedia.org/wiki/Boids" target="_blank"> From Boids article on Wikipedia  </a>

#### <a href="https://team.inria.fr/imagine/files/2014/10/flocks-hers-and-schools.pdf" target="_blank"> Flock Herds and Schools - Craig Reynolds</a>

### Following a vector field

* Easy first system
* Behavior analogous to fluid dynamics
* Simple model from <a href="http://red3d.com/cwr/steer/" target="_blank">Craig Reynolds</a>

Press `A` to display the vector field, `Z` to initialize a new vector field at random, and click on the canvas to start/stop the animation (the animation must be running for the vector field changes to be displayed).

<div id="flowfield-sketch" style="text-align: center;"></div>
<script src="{{"js/p5-libraries/p5.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"js/p5-libraries/p5.dom.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"js/p5-libraries/p5.sound.js" | relative_url}}" type="text/javascript"></script>
<script async src="{{"js/flow_field/flowfield.js" | relative_url}}" type="text/javascript"></script>
<script async src="{{"js/flow_field/vehicle.js" | relative_url}}" type="text/javascript"></script>
<script async src="{{"js/flow_field/field_sketch.js" | relative_url}}" type="text/javascript"></script>

### Herds, flocks and schools

* More complex dynamics
* Autonomous agents: behave according to their own set of rules
* Emergent behavior
* More complex model from <a href="http://red3d.com/cwr/boids/" target="_blank">Craig Reynolds</a>

In the same way, as an introduction to complex systems, you can play with some parameters of Reynold's flocking behavior in the animation below. Click on the canvas to start/stop the animation.

<div id="flocking-behavior-sketch" style="text-align: center;">

<section style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; grid-template-rows: 1fr 1fr 1fr; column-gap: 5%">
<div>
<b> Separation </b>
</div>
<div>
<b> Alignment </b>
</div>
<div>
<b> Cohesion </b>
</div>
<div>
<b> Distance </b>
</div>

<div class="p5-button-description">
Steer to avoid crowding local flockmates
</div>
<div class="p5-button-description">
Steer towards the average heading of local flockmates
</div>
<div class="p5-button-description">
Steer to move toward the average position of local flockmates
</div>
<div class="p5-button-description">
Distance at which a boid can see local flockmates <br> (size of the circles)
</div>

<div id = "separation"></div>
<div id = "alignment"></div>
<div id = "cohesion"></div>
<div id = "distance"></div>

</section>

</div>
<script async src="{{"js/flocking_behavior/boid.js" | relative_url}}" type="text/javascript"></script>
<script async src="{{"js/flocking_behavior/flock.js" | relative_url}}" type="text/javascript"></script>
<script async src="{{"js/flocking_behavior/flock_sketch.js" | relative_url}}" type="text/javascript"></script>

<hr style="border:0; border-top: dotted; margin:30px">

# Bibliograpy

<a href="https://en.wikipedia.org/wiki/Complex_system" target="_blank"> Complex Systems on wikipedia </a>

<a href="https://www.researchgate.net/publication/246294756_General_Features_of_Complex_Systems" target="_blank"> General Features of Complex Systems - Yaneer Bar-Yam </a>

<a href="https://www.lemonde.fr/smart-cities/article/2020/11/20/considerer-la-ville-comme-un-systeme-complexe-conduit-a-reduire-les-individus-a-des-atomes_6060472_4811534.html" target="_blank">  Pablo Jensen to the Abécédaire de la ville, in the french newspaper Le Monde </a>

<a href="http://www.scholarpedia.org/article/Complex_systems" target="_blank"> Complex Systems on Scholarpedia </a>

<a href="https://www.springer.com/gp/book/9781441965615" target="_blank"> Modelling Complex Systems - Nino Boccara </a>

<a href="https://link.springer.com/chapter/10.1007/978-94-010-9521-1_14" target="_blank"> The Organization of Complex Systems - Herbert A Simon </a>

<hr style="border:0; border-top: dotted; margin:30px">

# Technical Notes

To have several p5 canvas on the same page, I use the <a href="https://github.com/processing/p5.js/wiki/p5.js-overview#instantiation--namespace" target="_blank">instance mode of p5</a> as further explained in <a href="https://p5js.org/reference/#/p5/p5" target="_blank">the documentation</a>. Each canvas becomes its own object with its own scope, which means that at the cost of some re-writing (the function that are usually available in the global namespace have to be accessed through the sketch object itself) we get to display several canvas without them messing with each other.
