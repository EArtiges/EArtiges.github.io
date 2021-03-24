---
layout: post
title:  "Collective behaviour: an introduction to complex systems"
date:   2021-03-21 11:44:13 +0000
categories: complex-systems p5.js  
summary: Where we learn about the New York accent, computer graphics in the late 80s, the autonomy of birds, and where Jeff Goldblum makes a surprise appearance.
---


> #### Why did I write this article?
>* Complex Systems are OBJECTIVELY SUPER COOL (that has been scientifically proven like ten thousand times).
>* With an ever-increasing portion of the planet connected to internet, our worldview is now richer and deeper than ever, while remaining thoroughly incomplete. Complex Systems provide us with tools and concepts to address this problem.
>* I wanted to have a first article on my blog, and talking about something that I know seemed like a good place to start.
>* I wanted to put my web programming skills to the test by incorporating some p5.js to a Jekyll bog post.


# Complex Systems: introduction

> To a  Platonic mind, everything in the world is connected with everything else and perhaps it is. Everything is connected, but some things are more connected than others. 

Complexity Science cuts across a broad range of fields and provides us with an array of tools and methods to study any situation involving several parts of a puzzle interacting with each other. There is no single Object of Study: rather, provided that an object, organism, concept or situation can be expressed under the form of a so-called **Complex System**, it can become the Object of Study of complexity science.

When taking a look at the <a href="https://www.art-sciencefactory.com/complexity-map_feb09.html" target="_blank"> Map of the Complexity Sciences by Brian Castellani </a>, many scientific concepts that are still considered "hot" today can be tied to the notion of complexity in one way or another.

Some escaped the research labs and made their way into our lives through mainstream media:
* Network science (remember that 6-people thing?)
* Big data
* Artificial intelligence (Skynet, anyone?)
* Cognitive science
* Chaos theory (as introduced to many of us by Jeff Goldblum in 1993's <i>Jurassic Park</i>)
* Econophysics

Some are more confidential and are rather well-known from those among us that are more technical <small> (or at least I assume so, not having heard any of these names pronounced outside of an academic institution myself) </small> :
* Systems biology
* Agent-Based modeling
* Non-linear Systems
* Control Theory
* Intersectionality


# What is a Complex System?

#### <a href="https://en.wikipedia.org/wiki/Complex_system" target="_blank">  From Complex Systems on wikipedia </a>

> A complex system is a system composed of many components which may interact with each other. Such systems' behaviors are intrinsically difficult to model due to the interactions between their parts or with its environment. Complex Systems often (not always) feature so-called emergent behaviors and properties: traits of a system that are not apparent from its components in isolation but which result from their interactions. The term "emergent" broadly qualifies said behaviors and properties.

#### <a href="https://www.researchgate.net/publication/246294756_General_Features_of_Complex_Systems" target="_blank">  From General Features of Complex Systems - Yaneer Bar-Yam </a>

>"Complex Systems" is the new approach to science studying how relationships between parts give rise to the collective behaviors of a  system, and how the system interacts and forms  relationships  with  its  environment.  Social  systems  formed  (in  part)  out  of relationships between people, the brain formed out of neurons, molecules formed out of atoms,  the  weather  formed  out  of  air  flows  are  all  examples  of  complex  systems.

> When someone paints a picture, they place each patch of paint in a particular place to make the picture. In nature we notice that there are patterns that form without someone putting each part in a particular place. The pattern self-organizes. Sometimes these patterns are regular, like ripples of sand on a beach or in the desert, sometimes  they  are  very  intricate  and  have  an  intricate  functioning, such as the human body itself, which forms from a single cell by a process of development.

#### <a href="https://www.lemonde.fr/smart-cities/article/2020/11/20/considerer-la-ville-comme-un-systeme-complexe-conduit-a-reduire-les-individus-a-des-atomes_6060472_4811534.html" target="_blank"> From the contribution of Pablo Jensen to the Abécédaire de la ville, in the french newspaper Le Monde </a>

> First, the opposition between complex and simple systems. In simple systems, interactions between sub-systems are weak and do not result in surprising interactions at the collective level. Gas molecules for example, at the exception of rare collisions, follow random trajectories that are independent of one another: the properties of the gas as a whole are easily computed.

> It is important to differentiate "complex" from "intricate" systems (in which the system's properties are not emergent but the product of a grand design or a blueprint, like a plane or a computer). Quite the opposite, anthill galleries structures are a typical exemple of complex system, since it's carried out from the bottom up by worker ants without the coordination of the queen that would have the plans ready.

#### <a href="http://www.scholarpedia.org/article/Complex_systems" target="_blank"> From Scholarpedia </a>


> Emergent properties reflect the primordial role of interactions between parts. They are manifested by the creation of self-organized states of a hierarchical and modular type, where order and coherence are ensured by a bottom-up mechanism rather than through a top-down design and control.

> The intertwining, within the same phenomenon, of large scale regularities and seemingly erratic evolutionary trends. This coexistence of order and disorder raises the issue of predictability of the future evolution of the system at hand on the basis of the record available. Human systems such as traders in stock markets influencing both each other and the market itself are also confronted to unexpected crises and collapses, despite the rationality supposed to prevail at the individual level. Fractals and deterministic chaos provide valuable prototypes of coexistence of order and disorder in time and space.

> The conjunction of the probabilistic and deterministic descriptions as well as of the macroscopic and microscopic views opens the way to a multilevel approach at the heart of present day complexity research as summarized below.

>Predicting complex systems
Thanks to their inherent linearity and stability, probability distributions can be used to make reliable predictions on the future occurrence of events conditioned by the states prevailing at a certain time.

>Complexity, entropy and generalized dimensions
A probabilistic process can be characterized by a hierarchy of entropy-like quantities, describing the amount of data needed to identify a particular state of the system (Shannon entropy).

>Complexity and information
The probabilistic approach offers a representation of complex systems as sources and processors of information. They can be characterized by the length of the minimal algorithm that allows the observer to reproduce their evolution. Fully random sequences are the most complex ones in this perspective but it is believed that natural complexity lies between full order and full randomness.

>Scales, correlations, self-similarity
An alternative characterization of complex systems is in terms of correlations, a set of quantities describing, in an averaged way, how a system keeps in time and space the memory of a perturbation inflicted initially on one of its parts. As a rule the onset of complex behaviors is marked by the generation of long range correlations which in some extreme situations are scale free in the sense of displaying no privileged characteristic time or space scale.

> Simulating complex systems
Direct simulation of a process of interest, rather than the integration of a set of underlying evolution equations, is an indispensable element in the study of complex systems. Starting from a minimal amount of initial information deemed to be essential, different scenarios compatible with this information are explored. Generic aspects of complex behaviors observed across a wide spectrum of fields (in many of which the detailed structure of the constituting units and their interactions may not be known to a degree of certainty comparable to that of a physical law) are captured in this way through models governed by simple local rules. In their computer implementation these models provide attractive visualizations and deep insights, from Monte Carlo and multi-agent simulations to cellular automata and games.

#### <a href="https://www.springer.com/gp/book/9781441965615" target="_blank"> From Modelling Complex Systems - Nino Boccara </a>
Maybe keep this as quote?
> Gordon [190, 191] has shown that task allocation is a process of continual adjustment. The number of workers engaged in a specific task is appropriate to the current condition. When small piles of mixed seeds are placed outside the nest mound, away from the foraging trails but in front of scouting patrollers, early in the morning, active recruitment of foragers takes place. When toothpicks are placed near the nest entrance, early in the morning at the beginning of nest-maintenance activity, the number of nest-maintenance workers increases significantly.The surprising fact is that task allocation is accomplished without any central control. 
> Each individual ant processes [local information from the ants nearby through chemical and tactile communication] to decide which of the many possible functional roles it should play in the colony.The cooperative behavior of an ant colony that results from local interactions between its members and not from the existence of a central controller is referred to as emergent behavior. Emergent properties are defined as large-scale effects of locally interacting agents that are often surprising and hard to predict even in the case of simple interactions.

Why ?

#### <a href="https://en.wikipedia.org/wiki/Complex_system" target="_blank">  From Complex Systems on wikipedia </a>
> Because such systems appear in a wide variety of fields, the commonalities among them have become the topic of their independent area of research, which investigates how relationships between a system's parts give rise to its collective behaviors and how the system interacts and forms relationships with its environment.

#### <a href="https://www.researchgate.net/publication/246294756_General_Features_of_Complex_Systems" target="_blank">  From General Features of Complex Systems - Yaneer Bar-Yam </a>
Maybe keep this as quote?
> As  scientists,  we  would  like  to  understand  how  this  self-organizing  process  takes  place. We would like to understand the mechanism by which patterns form. We would also like to understand how the pattern that arises is determined. This could lead to a revolution in engineering and in management. The idea is that instead of specifying each of the parts of a system we want to build, we can specify a process that will create the  system that we want to make. 
> [...]
> There  is  another  motivation  for  understanding  self-organizing  patterns.  Patterns  of behavior  of  human  beings  in  economic  and  social  systems  also  cannot  be  explained directly  from  external  forces.  External  forces  cannot  explain  fads  of  people  buying products, and price changes in stock markets where prices change dramatically from day to day or even minute to minute. Traditional economics tries to understand how behavior is related to external forces. The interactions between people are, however, important in creating  fads  and  market  panics  as  well  as  day-to-day  fluctuations.  These  are  self-organizing  patterns.  Without  understanding  how  patterns  arise  from  the  interactions inside a system we cannot understand these behaviors.

> On increasing complexity around us, in social systems: Change in central control is going to continue. We  should expect that complexity will continue to increase, and this means that organizations will be less and less recognizable as hierarchies. We see this in many ways, even by considering how  informal  distributed  organizations  like  the  open-source  movement  are  challenging innovative but conventional organizations like Microsoft.

#### <a href="http://www.scholarpedia.org/article/Complex_systems" target="_blank"> From Scholarpedia </a>

> Traditional determinic description of a system, that focuses on detailed point-wise evolution of individual trajectories, can not account for the multiplicity, sensitivity and intrinsic randomness of complex systems.

#### <a href="https://link.springer.com/chapter/10.1007/978-94-010-9521-1_14" target="_blank"> The Organization of Complex Systems - Herbert A Simon </a>

> On hierarchies found in nature: It is a commonplace observation that nature loves hierarchies. Most of the complex systems that occur in nature find their place in one or more of four intertwined hierarchic sequences. 
* One [...] starts with observable chemical substances, [which are made of] molecules. Within the molecules are found atoms, within the atoms, nuclei and electrons, and finally  [...] within the nuclei are found elementary particles. 
* A second important hierarchy runs from living organisms to tissues and organs, to cells, to macromolecules, to organic compounds, to a  junction with the molecules of the first hierarchy. 
* A third, intertwined hierarchy leads from the statistics of inheritance to genes and chromosomes, to DNA, and all that. 
* A fourth hierarchy, not yet firmly connected with the others, leads from human societies to organizations, to small groups, to individual human beings, to cognitive programs in the central nervous system, to elementary information processes where the junctions with the tissues and organs of neurobiology largely remain to be discovered.

>  Scientific knowledge is organized in levels, not because reduction in principle is impossible, but because nature is organized in levels, and the pattern at each level is most clearly discerned by abstracting from the detail of the levels far below. (The pattern of a  halftone does not become clearer when we magnify it  so that the individual spots of ink become visible.) And nature is organized in levels because hierarchic structures systems of Chinese boxes  provide the most viable form for any system of even moderate complexity.


How?

#### <a href="https://en.wikipedia.org/wiki/Complex_system" target="_blank">  From Complex Systems on wikipedia </a>
> We need, in our approach of complex systems, to shift paradigm: instead of a top-down approach where we would expect a certain behaviour and consider deviations from our expectations to be noise, we must at the contrary focus on implementing low-levels rules as close as possible to what we know of reality, and consider the behaviour of the entire system our complete source of information.

#### <a href="https://www.researchgate.net/publication/246294756_General_Features_of_Complex_Systems" target="_blank">  From General Features of Complex Systems - Yaneer Bar-Yam </a>
Keep as quote
> Pushing  on  a  complex  system  "here"  often has effects "over there" because the parts are interdependent. This has become more and more  apparent  in  our  efforts  to  solve  societal  problems  or  avoid  ecological  disasters caused  by  our  own  actions. The  field  of  complex  systems  provides  a  number  of sophisticated tools, some of them concepts that help us think about these  systems, some of  them  analytical  for  studying  these  systems  in  greater  depth,  and  some  of  them computer-based for describing, modeling or simulating these systems.

> On complexity and information: More  generally,  a  complex system  is  hard  to  describe  and  the  problem  of  describing  it  is  central  to  our  ability  to understand it. Imagine that we have to study a description of the system. The longer the description,  the  longer  we  would  have  to  study  it.  This  makes  it  natural  to  define  the complexity of an object as the length of the description. An object that is more complex has a longer description. A simpler object has a shorter description. 

#### <a href="http://www.scholarpedia.org/article/Complex_systems" target="_blank"> From Scholarpedia </a>

> The probabilistic approach offers a natural alternative. Since the interactions between subsystems are usually unstable (read: subsystems make a mess), the quantities usually studied by deterministic approaches are now modulated by random fluctuations due to these unstable interactions (read: we can't be as precise). Therefore the probability distributions of these quantities become now the principal quantities of interest.


> Direct simulation of a process of interest, rather than the integration of a set of underlying evolution equations, is a standard approach in the study of complex systems. Implementing a minimal set of simple, essential local rules proves to capture generic complex behaviors across a wide spectrum of fields with surprising generality: the detailed structure of the subsystems do not need to be known neither implemented for observed behavior to arise in the simulation. By providing direct control to the user and allowing her to receive direct feedback, computer implementations of these models can provide deep insight on different scenarios.


#### <a href="https://link.springer.com/chapter/10.1007/978-94-010-9521-1_14" target="_blank"> The Organization of Complex Systems - Herbert A Simon </a>

> Building stable sub-systems and combining them together to make a bigger structure is a much safer and faster evolutionary strategy because it drastically reduces the amount of possible combinations and it builds resilience in a system. In this configuration, each subsystem acts as a black box that takes an input and produces an output; how it does that is irrelevant at the scale of the interaction between subsystems. The general organisation of a system is therefore independent of the internal structure of its subsystems. In Herbert A Simon's words, <q> we can build a  theory of the system at the level of dynamics that is  observable, in ignorance of the detailed structure or dynamics at the next level down, and ignore the very slow interactions at the next level up. </q>.

Keep this as a quote
> A mammal's circulatory system is loosely coupled to other systems. It receives oxygen from the respiratory system and nutrients from the digestive system. It  delivers these to the muscles, say, from which it receives carbon dioxide, and other wastes. These it delivers, in turn, to lungs and kidneys, and so on. Just how the circulatory system accomplishes these tasks is  of no concern, so to speak, to the other systems, as long as it does accomplish them. Appropriate evolutionary changes may take place in any one of these systems without necessarily, or immediately, disturbing the others. Natural selection may improve a  horse's locomotion without necessarily changing his digestion.

## Reynolds Boids

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

# Technical Notes

To have several p5 canvas on the same page, I use the <a href="https://github.com/processing/p5.js/wiki/p5.js-overview#instantiation--namespace" target="_blank">instance mode of p5</a> as further explained in <a href="https://p5js.org/reference/#/p5/p5" target="_blank">the documentation</a>. Each canvas becomes its own object with its own object, which means that at the cost of some re-writing (the function that are usually available in the global namespace have to be accessed through the sketch object itself) we get to display several canvas without them messing with each other.
