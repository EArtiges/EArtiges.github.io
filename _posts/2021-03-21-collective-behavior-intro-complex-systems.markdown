---
layout: post
title:  "Collective behaviour: an introduction to complex systems"
date:   2021-03-21 11:44:13 +0000
categories: complex-systems complexity p5.js  
summary: Where we learn about the New York accent, computer graphics in the late 80s, the autonomy of birds, and where Jeff Goldblum makes a surprise appearance.
image: assets/boids.png
---

> To a  Platonic mind, everything in the world is connected with everything else and perhaps it is. Everything is connected, but some things are more connected than others. <br>
> <p class="quote-author"> Herbert A. Simon, Nobel Price of Economy </p>

# What is a Complex System?

#### A whole greater than the sum of its parts

Complexity Science is a young approach to science studying how the collective behaviour of a whole emerges from the relationships between its parts. A complex system is composed of many subsystems which interact with one another (e.g social systems formed out of relationships between people, the brain formed out of neurons, etc). Such systems' behaviours are intrinsically difficult to predict due to the interactions between their parts and/or their environment.

Another definition of complex systems arises by the negative: to say that something is complex means that it is not simple. In simple systems, interactions between sub-systems are weak and do not result in surprising properties at the collective level. Gas molecules follow random trajectories that are relatively independent of one another (shocks between molecules of gas are actually quite rare): the properties of the gas as a whole are quite predictable, it's a simple system.

It is also important to differentiate "complex" from "intricate" systems (in which the system's properties are not emergent but the product of a grand design or a blueprint, like a plane or a computer). Quite the opposite, anthill galleries structures are a typical example of complex system, since it's carried out from the bottom up by worker ants without the coordination of the queen that would have the anthill plans ready.

#### A decentralized entity

French mathematician Nino Boccara, about the organization of workers in an ant colony:
> The number of workers engaged in a specific task is appropriate to the current condition. [...] When toothpicks are placed near the nest entrance at the beginning of nest-maintenance activity, the number of nest-maintenance workers increases significantly. The surprising fact is that task allocation is accomplished without any central control. <br>
> Each individual ant processes [local information from the ants nearby] to decide which of the many possible functional roles it should play in the colony. The cooperative behaviour of an ant colony that results from local interactions between its members is referred to as emergent behaviour. <br>
> <p class="quote-author"> - Nino Boccara </p>

Emergent properties reflect the primordial role of interactions between parts. They are manifested by self-organisation, where order and coherence are ensured by a bottom-up mechanism rather than through a top-down design and control. In the example above, no two ants have the same experience or the same neighbours: their individual trajectories and actions are impossible to predict because they are the results of a myriad of feedback loops of interaction.

This coexistence of global stability and local disorder makes it difficult to predict a system's evolution: while we can be somewhat certain of its long term stability, it's very hard to predict in which state it is going to be found at a given point in time. Human systems such as traders in stock markets influencing both each other and the market itself are also confronted to unexpected crises and collapses, despite the rationality supposed to prevail at the individual level.

#### A challenge for scientists

In physics, the classical approach to a system (inherited from classical mechanics) is to put it in equations, and then to obtain a solution by solving these equations (either exactly or approximately). Think of Isaac Newton and the apple: Gravity pulls the apple, the apple falls down. If I know the initial position of the apple and the laws of physics, I can predict with exactitude where it will land.

> Easy peasy.
> <p class="quote-author">  - Isaac Newton </p>

Now what if Newton drops a whole bucket of apples on the ground (silly you, Isaac)? Suddenly it's not so straightforward anymore to predict where each apple will land: the apples will tumble down, kick each other as they touch the ground, and keep on ricochet like snooker balls until they finally stop in a corner. Because of the multiple interactions between fruits, the knowledge of the laws of physics and of the initial positions of the apples are not enough for me to tell you the place where each apple will land and stop moving, at least not by solving equations. Answering this problem (and others that fall in the same category) requires scientists to figure out new ways of asking relevant questions.

# Why should we care about Complex Systems?

> Because Complex Systems are everywhere!
> <p class="quote-author">  - me </p>


#### In human societies:

Don't take my word for it. Take Herbert A. Simon's, American Nobel Price of economy:  

> We  should expect that [social and technologic] complexity will continue to increase, and this means that organizations will be less and less recognizable as hierarchies. We see this in many ways, even by considering how  informal  distributed  organizations  like  the  open-source  movement  are  challenging innovative but conventional organizations like Microsoft.

> As  scientists,  we  would  like  to  understand  how  this  self-organizing  process  takes  place. We would like to understand the mechanism by which patterns form. This could lead to a revolution in engineering and in management.

> Patterns of behaviour of human  beings in economic  and  social  systems  also  cannot  be  explained directly  from  external  forces.  External  forces  cannot  explain  fads  of  people  buying products, or price changes in stock markets where prices change dramatically from day to day or even minute to minute. [...] The interactions between people are, however, important in [the creation of these phenomena]. These  are  self-organizing  patterns.  Without  understanding  how  patterns  arise  from  the  interactions inside a system we cannot understand these behaviours. <br>
> <p class="quote-author">  - Herbert Simon </p>

#### In nature:

Complex systems are also omnipresent in biology and evolutionary processes, mainly because of their inherently hierarchical structure, that provides a fertile ground for a selection process at different levels. Building stable sub-systems and combining them together to make a bigger structure is a much safer and faster evolutionary strategy:
* It drastically reduces the amount of possible combinations (you get faster from bacteria to spider if you evolve first the stable building blocks that are legs and eyes and copy/paste them into a tarentula, than if you try to get eight of each by random combinations of cell agencement)
* And it builds resilience in a system (if a block messes up, the others are still functional. That's why my best friend has asthma and he still thrived: his respiratory system was impaired but his other organs worked fine).

> A mammal's circulatory system [...] receives oxygen from the respiratory system and nutrients from the digestive system. It delivers these to the muscles from which it receives carbon dioxide, and other wastes. These it delivers, in turn, to lungs and kidneys, and so on. How the circulatory system accomplishes these tasks is of no concern to the other systems, as long as it does accomplish them. Appropriate evolutionary changes may take place in any one of these systems [without] disturbing the others. Natural selection may improve a horse's locomotion without necessarily changing his digestion. <br>
> <p class="quote-author">  - Herbert Simon </p>

#### In the confines of the universe:


Most of Complex Systems found in nature fit in one or more of four intertwined hierarchic sequences:
* From observable chemical substances, which are made of molecules. Within the molecules are found atoms, within the atoms, nuclei and electrons, and within the nuclei, elementary particles.
* From living organisms to tissues and organs, to cells, to macromolecules, to organic compounds, to a  junction with the molecules of the first hierarchy.
* From the statistics of inheritance to genes and chromosomes, to DNA.
* From human or animal societies to organizations, to small groups, to individual living beings, to cognitive programs in the central nervous system, to elementary information processes where the junctions with the tissues and organs of neurobiology largely remain to be discovered.

# How can we study Complex Systems?

We need, in our approach of complex systems, to shift paradigm: instead of a top-down approach like Isaac and the apple, we must at the contrary focus on implementing low-levels rules as close as possible to what we know of reality, and consider the behaviour of the entire system our object of study.

> Pushing  on  a  complex  system  "here"  often has effects "over there" because the parts are interdependent. This has become more and more  apparent  in  our  efforts  to  solve  societal  problems  or  avoid  ecological  disasters caused  by  our  own  actions. The  field  of  complex  systems  provides  a  number  of sophisticated tools, some of them concepts that help us think about these  systems, some of  them  analytical  for  studying  these  systems  in  greater  depth,  and  some  of  them computer-based for describing, modeling or simulating these systems. <br>
> <p class="quote-author">  - Nino Boccara </p>

Using probabilities is a natural alternative to the exact approach I described earlier. Since the interactions between subsystems are usually unstable (read: apples kicking each other make a mess), the quantities usually studied by deterministic approaches are now subject to random fluctuations due to these unstable interactions (read: apples from the bucket will fall less straight than the apple from the tree). Therefore the probability distributions of these quantities become now the principal quantities of interest (read: "It will laaaaaand... About here. Best I can do").

Rather than solving a set of equations, using simulations is another standard approach in the study of complex systems. Finding a minimal set of simple, local rules and write a program to see them in action captures complex behaviours with surprising generality: the detailed structure of the subsystems matter not (a <a href="https://www.complexity-explorables.org/explorables/a-patchwork-darwinge/" target="_blank"> Darwinian evolution simulation </a> can teach us about mutation selection by reducing animals to a single number). By providing some control to the user and allowing her to receive direct feedback, computer implementations of these models can provide deep insight on different scenarios.

I would like to demonstrate that here and now.

### Reynolds Boids

In 1986, <a href="http://www.red3d.com/cwr/" target="_blank">Craig Reynolds</a> was working in the Graphics Division of Symbolics, working on simulating collective behaviour (inspired by living organisms) for games and the arts. He came up with several models but I think that two of them are particularly relevant to understand the shift in paradigm that complex systems require with respect to classical physics and other sciences:

* a **steering behaviour** model, where the motion of animals is largely dictated by their environment;
* a model of coordinated animal motion that he coined **boid** for bird-oid (maybe he found also fitting that "boid" resembles the pronounciation of the word "bird" with an NYC accent), where the motion of animals (the boids) is only dictated by a few simple behaviour rules;

The difference in behaviour between a flock of boids simulated by the steering model and a flock of boids simulated by the **boid** model is quite spectacular and illustrate rather well the difference between a top-down and a bottom-up approach, between local interactions rules and a grand design.

### Following the wind: the classical approach

This model is inspired from Craig Reynolds' <a href="http://red3d.com/cwr/steer/" target="_blank">**steering model**</a>. In this simple iteration, each boid follows the wind (modeled by a vector field). The knowledge of the wind direction and the laws of physics is enough, in this case, to predict with a pretty high accuracy what the trajectory of each boid is going to be quite far in the future: the flock of boids, in this case, is rather like a queue of boids, all roughly following the same trajectory through the gulfs of wind.

This type of model is a much simpler version of models that are used in fluid dynamics, for example.

#### Why is this not a complex system ?
Because in this case, the boids follow a path that is imposed to them by an external pressure (the wind direction); their trajectory is therefore highly predictable and is not dependent on the trajectory of their flockmates. The behaviour of the system "flock of boids" is the result of an external factor rather than the interaction of the boids with each other.

Press `A` to display the vector field, `Z` to initialize a new vector field at random, and click on the canvas to start/stop the animation (the animation must be running for the vector field changes to be displayed).

<div id="flowfield-sketch" style="text-align: center;"></div>
<script src="{{"js/p5-libraries/p5.js" | relative_url}}" type="text/javascript"></script>
<script async src="{{"js/flow_field/flowfield.js" | relative_url}}" type="text/javascript"></script>
<script async src="{{"js/flow_field/vehicle.js" | relative_url}}" type="text/javascript"></script>
<script async src="{{"js/flow_field/field_sketch.js" | relative_url}}" type="text/javascript"></script>

### Herds, flocks and schools: the complexity approach

This model is inspired from Craig Reynolds' <a href="http://red3d.com/cwr/boids/" target="_blank">**boid model**</a>. In this iteration, each boid is an autonomous agent and follows a set of rules that dictate where it will head next:
* Boids try to align with their nearest neighbours
* Boids try to avoid collision
* Boids try to form cohesive flocks.

In this case, the knowledge of these behaviour rules are not enough to predict with any level of accuracy what the trajectory of each boid is going to be quite far in the future.

#### Why is this a complex system ?
Because in this case, the boids follow a path that is imposed to them by their interactions; a boid's individual trajectory influences **and** is influenced by all other flockmates' trajectory. The presence of these many feedbacks loop render impossible a prediction of any individual boid's trajectory further than a few seconds away. The behaviour of the system "flock of boids" is the result of the interaction between the boids themselves rather than the product of an external plan or design.

This time, individual boids behaviour creates larger structures: groups (flocks) of various sizes, heading their own way. The formation and the interaction of these larger structures themselves (the merging and splitting of different flocks) are emergent properties of the system. This should remind us of what Herbert Simon wrote about the interaction of structures at their own level: several boids interact to form a flock, and several flock interact to form this delicate ballet of going apart and coming together.

#### What should I pay attention to ?
By turning all the sliders to 0 except **Distance** which should be set to maximum, you'll create pure randomness. The boids will go about their business not minding any other boid, and will behave essentially as if they were alone in the universe (think annoying guy on the highway).

Slowly increasing **Separation** up until 50% will now cause the boids to avoid each other. You should start to see that they occupy the space in a much more homogeneous way: this is already not pure randomness anymore.

Now increasing **Alignment** will suddenly generate a large-scale behaviour: gradually all boids will move in roughly the same direction. Yet none of them can see what is happening outside of their **Distance** radius, and all of them have different neighbours. **Global order emerges from local disorder.** You should start to see some group forming, but none of them lasts for very long or seems to have a defined existence of their own.

Increasing **Cohesion** up to 25% should bring about a drastic change: suddenly flocks are much more defined and seem to have an existence of their own!

<div id="flocking-behaviour-sketch" style="text-align: center;">

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
<script async src="{{"js/flocking_behaviour/boid.js" | relative_url}}" type="text/javascript"></script>
<script async src="{{"js/flocking_behaviour/flock.js" | relative_url}}" type="text/javascript"></script>
<script async src="{{"js/flocking_behaviour/flock_sketch.js" | relative_url}}" type="text/javascript"></script>

You can now play around with these settings:
* see what happens when you turn down **Alignment** to 0 (or 100)%, for example!
* or what happens when you reduce the **Distance** at which boids can see each other?

You get to decide how you want to interpret each slider, and therefore, the behaviour of the boids as a result.

I will not blabber for much longer now, but I would like to leave you with this wonderfully synthetic (almost meditative) statement by Craig Reynolds himself, that connects all the dots and beautifully reminds us about the coexistence of order and disorder in all aspects of our existence:

> A significant property of life-like behaviour is unpredictability over moderate time scales. For example at one moment, the boids in the applet above might be flying primarily from left to right. It would be all but impossible to predict which direction they will be moving (say) five minutes later. At very short time scales the motion is quite predictable: one second from now a boid will be traveling in approximately the same direction. This property is unique to complex systems and contrasts with both chaotic behaviour (which has neither short nor long term predictability) and ordered (static or periodic) behaviour. This fits with Langton's 1990 observation that life-like phenomena exist poised at the edge of chaos. <br>
> <p class="quote-author">  - Craig Reynolds </p>

<hr style="border:0; border-top: dotted; margin:30px">

# Bibliograpy

<a href="https://en.wikipedia.org/wiki/Complex_system" target="_blank">Complex Systems on wikipedia</a>

<a href="https://www.researchgate.net/publication/246294756_General_Features_of_Complex_Systems" target="_blank">General Features of Complex Systems - Yaneer Bar-Yam</a>

<a href="https://www.lemonde.fr/smart-cities/article/2020/11/20/considerer-la-ville-comme-un-systeme-complexe-conduit-a-reduire-les-individus-a-des-atomes_6060472_4811534.html" target="_blank">Pablo Jensen to the Abécédaire de la ville, in the french newspaper Le Monde</a>

<a href="http://www.scholarpedia.org/article/Complex_systems" target="_blank">Complex Systems on Scholarpedia</a>

<a href="https://www.springer.com/gp/book/9781441965615" target="_blank">Modelling Complex Systems - Nino Boccara</a>

<a href="https://link.springer.com/chapter/10.1007/978-94-010-9521-1_14" target="_blank">The Organization of Complex Systems - Herbert A Simon</a>

<a href="https://en.wikipedia.org/wiki/Boids" target="_blank">Boids article on Wikipedia</a>

<a href="https://team.inria.fr/imagine/files/2014/10/flocks-hers-and-schools.pdf" target="_blank">Flock Herds and Schools - Craig Reynolds</a>

A great part of the code comes from: <a href="https://www.kadenze.com/courses/the-nature-of-code-ii/info" target="_blank">The Nature of Code - Daniel Shiffman</a> on Kadenze

<hr style="border:0; border-top: dotted; margin:30px">

# Why did I write this article?
* Complex Systems are objectively super cool (that has been scientifically proven like ten thousand times).
* With an ever-increasing portion of the planet connected to internet, our worldview is now richer and deeper than ever, while remaining thoroughly incomplete. Complex Systems provide us with tools and concepts to address this problem.
* I wanted to have a first article on my blog, and talking about something that I know seemed like a good place to start.
* I wanted to put my web programming skills to the test by incorporating some p5.js to a Jekyll bog post.

<hr style="border:0; border-top: dotted; margin:30px">

# Technical Notes

To have several p5 canvas on the same page, I use the <a href="https://github.com/processing/p5.js/wiki/p5.js-overview#instantiation--namespace" target="_blank">instance mode of p5</a> as further explained in <a href="https://p5js.org/reference/#/p5/p5" target="_blank">the documentation</a>. Each canvas becomes its own object with its own scope, which means that at the cost of some re-writing (the function that are usually available in the global namespace have to be accessed through the sketch object itself) we get to display several canvas without them messing with each other.
