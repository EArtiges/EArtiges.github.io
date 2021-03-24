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

> Picture the world interacting

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
* On the Ant colony: Gordon [190, 191] has shown that task allocation is a process of continual adjustment. The number of workers engaged in a specific task is appropriate to the current condition. When small piles of mixed seeds are placed out-side the nest mound, away from the foraging trails but in front of scouting patrollers, early in the morning, active recruitment of foragers takes place.When toothpicks are placed near the nest entrance, early in the morning at the beginning of nest-maintenance activity, the number of nest-maintenance workers increases significantly.The surprising fact is that task allocation is accomplished without any central control. The queen does not decide which worker does what. No master ant could possibly oversee the entire colony and broadcast instructions to the individual workers. An individual ant can only perceive local information from the ants nearby through chemical and tactile communication. Each individual ant processes this partial information to decide which of the many possible functional roles it should play in the colony.The cooperative behavior of an ant colony that results from local interactions between its members and not from the existence of a central controller is referred to as emergent behavior. Emergent properties are defined as large-scale effects of locally interacting agents that are often surprising and hard to predict even in the case of simple interactions. Such a definition is not very satisfying: what might be surprising to someone could be not, so surprising to someone else.
* The appearance of emergent properties is the single most distinguishing feature of complex systems. Probably, the most famous example of a system that exhibits emergent properties as a result of simple interacting rules be-tween its agents is the game of life invented by John H. Conway. This game is played on an (infinite) two-dimensional square lattice. Each cell of the lattice is either on (occupied by a living organism) or off (empty). If a cell is off,it turns on if exactly three of its eight neighboring cells (four adjacent orthogonally and four adjacent diagonally) are on (birth of a new organism). If a cell is on, it stays on if exactly two or three of its neighboring cells are on (survival), otherwise it turns off (death from isolation or overpopulation). These rules are applied simultaneously to all cells. Populations evolving according to these rules exhibit endless unusual and unexpected changing patterns


Why ?

#### <a href="https://en.wikipedia.org/wiki/Complex_system" target="_blank">  From Complex Systems on wikipedia </a>
* Because such systems appear in a wide variety of fields, the commonalities among them have become the topic of their independent area of research, which investigates how relationships between a system's parts give rise to its collective behaviors and how the system interacts and forms relationships with its environment.

#### <a href="https://www.researchgate.net/publication/246294756_General_Features_of_Complex_Systems" target="_blank">  From General Features of Complex Systems - Yaneer Bar-Yam </a>
* As  scientists,  we  would  like  to  understand  how  this  self-organizing  process  takes  place. We would like to understand the mechanism by which patterns form. We would also like to understand how the pattern that arises is determined. This could lead to a revolution in engineering and in management. The idea is that instead of specifying each of the parts of a system we want to build, we can specify a process that will create the  system that we want to make. This process would use the natural dynamics of the world to help us create what we want to make.
* There  is  another  motivation  for  understanding  self-organizing  patterns.  Patterns  of behavior  of  human  beings  in  economic  and  social  systems  also  cannot  be  explained directly  from  external  forces.  External  forces  cannot  explain  fads  of  people  buying products, and price changes in stock markets where prices change dramatically from day to day or even minute to minute. Traditional economics tries to understand how behavior is related to external forces. The interactions between people are, however, important in creating  fads  and  market  panics  as  well  as  day-to-day  fluctuations.  These  are  self-organizing  patterns.  Without  understanding  how  patterns  arise  from  the  interactions inside a system we cannot understand these behaviors.
* On increasing complexity around us, in social systems: We can also learn that the change in central control is going to continue. The world, with billions  of  people,  can  become  much  more  complex  than  a  human  being.  We  should expect that complexity will continue to increase, and this means that organizations will be less and less recognizable as hierarchies. We see this in many ways, even by considering how  informal  distributed  organizations  like  the  open-source  movement  are  challenging innovative but conventional organizations like Microsoft.

#### <a href="http://www.scholarpedia.org/article/Complex_systems" target="_blank"> From Scholarpedia </a>
* On the basis of the foregoing it appears that the multiplicity, sensitivity and intrinsic randomness of complex systems cannot be fully accounted for by the traditional deterministic description, in which one focuses on the detailed point-wise evolution of individual trajectories.

#### <a href="https://link.springer.com/chapter/10.1007/978-94-010-9521-1_14" target="_blank"> The Organization of Complex Systems - Herbert A Simon </a>
* Scientific knowledge is organized in levels, not because reduction in principle is impossible, but because nature is organized in levels, and the pattern at each level is most clearly discerned by abstracting from the detail of the levels far below. (The pattern of a  halftone does not become clearer when we magnify it  so that the individual spots of ink become visible.) And
* On hierarchies found in nature: It is a commonplace observation that nature loves hierarchies. Most of the complex systems that occur in nature find their place in one or more of four intertwined hierarchic sequences. One partial ordering of boxes starts with observable chemical substances. Analysis of these discloses sets of component molecules. Within the molecules are found atoms, within the atoms, nuclei and electrons, and finally  or is  it  momentarily? within the nuclei are found elementary particles.A second important hierarchy runs from living organisms to tissues and organs, to cells, to macromolecules, to organic compounds, to a  junction with the molecules of the first hierarchy. A third, intertwined hierarchy leads from the statistics of inheritance to genes and chromosomes, to DNA, and all that. A fourth hierarchy, not yet firmly connected with the others, leads from human societies to organizations, to small groups, to individual human beings, to cognitive programs in the central nervous system, to elementary information processes where the junctions with the tissues and organs of neurobiology largely remain to be discovered.
* Notice that in my plea for a hybrid Laplacian-Mendelian approach to fundamental science I have given no defense of vitalism, nor have I  alluded to the Heisenberg Uncertainty Principle. Both of these seem to me red herrings across our particular path of inquiry. Scientific knowledge is organized in levels, not because reduction in principle is impossible, but because nature is organized in levels, and the pattern at each level is most clearly discerned by abstracting from the detail of the levels far below. (The pattern of a  halftone does not become clearer when we magnify it  so that the individual spots of ink become visible.) And nature is organized in levels because hierarchic structures systems of Chinese boxes  provide the most viable form for any system of even moderate complexity.


How?

#### <a href="https://en.wikipedia.org/wiki/Complex_system" target="_blank">  From Complex Systems on wikipedia </a>
* "Systems exhibit complexity" means that their behaviors cannot be easily inferred from their properties. Any modeling approach that ignores such

difficulties or characterizes them as noise, then, will necessarily produce models that are neither accurate nor useful.
#### <a href="https://www.researchgate.net/publication/246294756_General_Features_of_Complex_Systems" target="_blank">  From General Features of Complex Systems - Yaneer Bar-Yam </a>
* About interdependence: Pushing  on  a  complex  system  "here"  often has effects "over there" because the parts are interdependent. This has become more and more  apparent  in  our  efforts  to  solve  societal  problems  or  avoid  ecological  disasters caused  by  our  own  actions.  The  field  of  complex  systems  provides  a  number  of sophisticated tools, some of them concepts that help us think about these  systems, some of  them  analytical  for  studying  these  systems  in  greater  depth,  and  some  of  them computer-based for describing, modeling or simulating these systems.  

#### <a href="https://www.researchgate.net/publication/246294756_General_Features_of_Complex_Systems" target="_blank">  From General Features of Complex Systems - Yaneer Bar-Yam </a>
* On complexity and information: More  generally,  a  complex system  is  hard  to  describe  and  the  problem  of  describing  it  is  central  to  our  ability  to understand it. Imagine that we have to study a description of the system. The longer the description,  the  longer  we  would  have  to  study  it.  This  makes  it  natural  to  define  the complexity of an object as the length of the description. An object that is more complex has a longer description. A simpler object has a shorter description. The idea that complexity is measured by the length of the description seems, however, to suggest  that  complexity  is  a  very  slippery  thing.  If  we  are  describing  something  to another person, the length of a description that we need depends on what the other person knows, and even what language we are using. The idea that complexity is not an absolute, but is relative to who is giving the description and who is receiving the description should not discourage us from thinking about complexity. Descriptions are always relative to the observer and this is even recognized in physics.

#### <a href="http://www.scholarpedia.org/article/Complex_systems" target="_blank"> From Scholarpedia </a>
* The probabilistic approach offers a natural alternative. A fundamental point is that the evolution of systems composed of several subunits and undergoing complex dynamics can be mapped into a probabilistic description in a self-consistent manner, free of heuristic approximations. The evolution of the relevant variables takes then a form where the values featured in the deterministic description are modulated by the random fluctuations generated by the strongly unstable dynamics prevailing at the microscopic level. This accentuates further the variety of the behaviors available and entails that the probability distribution functions, rather than the variables themselves, become now the principal quantities of interest. They obey to evolution equations like the master equation or the Fokker-Planck equation which are linear and guarantee (under mild conditions) uniqueness and stability of the stationary probability densities, contrary to the deterministic description which is nonlinear and generates multiplicity and instability.
* Direct simulation of a process of interest, rather than the integration of a set of underlying evolution equations, is an indispensable element in the study of complex systems. Starting from a minimal amount of initial information deemed to be essential, different scenarios compatible with this information are explored. Generic aspects of complex behaviors observed across a wide spectrum of fields (in many of which the detailed structure of the constituting units and their interactions may not be known to a degree of certainty comparable to that of a physical law) are captured in this way through models governed by simple local rules. In their computer implementation these models provide attractive visualizations and deep insights, from Monte Carlo and multi-agent simulations to cellular automata and games.

#### <a href="https://link.springer.com/chapter/10.1007/978-94-010-9521-1_14" target="_blank"> The Organization of Complex Systems - Herbert A Simon </a>
* On the speed of evolution: [ Watchmakers analogy: building stable subsystems and assembling them gets you there much faster than assembling a single big system directly] We conclude that hierarchies will evolve much more rapidly from elementary constituents than will non-hierarchic systems containing the same number of elements. Hence, almost all the very large systems will have hierarchic organization. And this is  hat we do, in fact, observe in nature.
* On near-decomposability: The middle band of frequencies, which remains after we have eliminated the very high and very low frequencies, will determine the observable dynamics of the system under study the dynamics of interaction of the major subsystems. As we have seen, these dynamics will be nearly independent of the detail of the internal structure of the subsystems, which will never be observed far from equilibrium. Hence, we can build a  theory of the system at the level of dynamics that is  observable, in ignorance of the detailed structure or dynamics at the next level down, and ignore the very slow interactions at the next level up.
* On loose horizontal coupling: To a first approximation, the behavior of any given subsystem will depend only on the frequencies belonging to it, together with the lower frequencies belonging to systems at higher levels of the hierarchy. It  will be independent of the frequencies associated with other subsystems at the same or lower levels of the hierarchy. (I am sorry that high "frequencies" correspond to low "levels," but it  can't be helped.) The loose horizontal coupling of the components of hierarchic systems has great importance for evolutionary processes just as the loose vertical coupling does. The loose vertical coupling permits the stable subassemblies to be treated as simple givens, whose dynamic behavior is  irrelevant to assembling the larger structures, only their equilibrium properties affecting system behavior at the higher levels.The loose horizontal coupling permits each subassembly to operate dynamically in independence of the detail of the others; only the inputs it requires and the outputs it produces are relevant for the larger aspects of system behavior. In programming terms, it is permissible to improve the system by modifying any one of the subroutines, provided that the subroutine's inputs and outputs are not altered.
* The loose horizontal coupling of components can be observed at all levels of hierarchic structures. Thus, a  mammal's circulatory system is loosely coupled to other systems. It receives oxygen from the respiratory system and nutrients from the digestive system. It  delivers these to the muscles, say, from which it receives carbon dioxide, and other wastes. These it delivers, in turn, to lungs and kidneys, and so on. Just how the circulatory system accomplishes these tasks is  of no concern, so to speak, to the other systems, as long•as it does accomplish them. Appropriate evolutionary changes may take place in any one of these systems without necessarily, or immediately, disturbing the others. Natural selection may improve a  horse's locomotion without necessarily changing his digestion, although changes in the metabolic rates associated with one subsystem may, on a  longer time scale, bring about natural selection of new adaptations of other subsystems.
* On loose coupling: Our whole discussion to this point underscores the crucial significance of hierarchic organization to the synthesis and survival of large, complex systems. To a  Platonic mind, everything in the world is connected with everything else and perhaps it  is. Everything is  connected, but some things are more connected than others. The world is  a large matrix of interactions in which most of the entries are very close to zero, and in which, by ordering those entries according to their orders of magnitude, a distinct hierarchic structure can be discerned.By virtue of hierarchic structure, the functional efficacy of the higher-level structures, their stability, can be made relatively independent of the detail of their microscopic components. By virtue of hierarchy, the several components on any given level can preserve a measure of independence to adapt to their special aspects of the environment without destroying their usefulness to the system.

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
