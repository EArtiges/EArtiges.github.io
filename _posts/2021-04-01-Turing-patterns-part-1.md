---
layout: post
title:  "Turing patterns: beautiful hot mess - part 1/2"
date:   2021-04-01 16:01:13 +0000
categories: complex-systems complexity turing-patterns p5.js
summary: Where we learn about foxes, rabbits, and how two ideas can be relevant to each other more than a century apart.
---

<script>
function show_element(element_id) {
  var x = document.getElementById(element_id);
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
</script>


This article is the second of a series of 3 on the topic of Turing patterns. In the <a href="https://eartiges.github.io/numerical-physics/classical-physics/turing-patterns/p5.js/2021/04/01/Heat-equation.html" target="_blank">first one</a>, I quickly sketched out the main steps in solving the diffusion equation, and I touched on how to interpret its various parameters. If you are already familiar with Fourier series and diffusion equations, you can start here without feeling lost. Otherwise, why not go and have a look? It has nice animations!

In this article I'll mainly talk about Turing patterns, expose a few mathematical tools useful in their characterization and explain the idea behind them. I'll leave the heavier mathematics for the last installment of the series.

<hr style="border:0; border-top: dotted; margin:30px">
> This series of articles is dedicated to <a href="https://unizar.academia.edu/CarlosGraciaLazaro" target="_blank">Carlos Gracia Lázaro</a> and <a href="https://fmc0.unizar.es/people/floria/" target="_blank">Mario Floria</a>, who were both gentle, masterful and inspiring mentors to me. They pointed me towards the elegance of linear systems, and I grew better a scientist thanks to their guidance. 
<hr style="border:0; border-top: dotted; margin:30px">

Turing patterns is a fascinating phenomenon that gives birth to a plethora of designs found in nature, like fish stripes or chemical stability regions. As complex systems amateurs, it is very natural that we want to know more about them: where do they arise from? Can we figure out a set of conditions for their existence? etc.

After <a href="https://eartiges.github.io/numerical-physics/classical-physics/turing-patterns/p5.js/2021/04/01/Heat-equation.html" target="_blank">learning all about the mysteries of diffusion</a>, we turn ourselves to the next logical step: instead of a single quantity diffusing (like temperature), how about two different quantities diffusing in the same medium, and interacting together? If you have read <a href="https://eartiges.github.io/complex-systems/complexity/p5.js/2021/03/21/collective-behavior-intro-complex-systems.html" target="_blank">my first article on complex systems</a>, you know that interesting things arise when there are interactions at hand. Specifically, if two quantities (animal species, religions, molecules) were to diffuse and interact with one another, would the situation eventually settle down (= reach an equilibrium)? If yes, what would it look like? In a prey/predator system for example, it is known that a balance exists between the two species: too many rabbits, and the foxes will feast upon them, thus growing in numbers. Too many foxes, and there won't be enough rabbits to eat, thus reducing the fox population.

<blockquote>
More prey - > more predators -> less preys. <br>
More predators -> less preys -> less predators. <br>
<p class="quote-author"> - Mother Nature </p>
</blockquote>

# The reaction-diffusion equations

It turns out that modeling such systems (called dynamical systems) is very straightforward once we understood diffusion equations. Here, let me show you:

**Step 1** : take the equations that model the diffusion of both quantities over time (the only thing that differs between both these equations is their diffusion coefficient **c**: it controls the speed of the diffusion for each quantity):

$$ \frac{du}{dt} = c_u \Delta u $$

$$ \frac{dv}{dt} = c_v \Delta v $$

Here for example, $$u$$ could be the population of rabbits and $$v$$ the population of foxes.

**Step 2** : Add an interaction term to explain what happens to the quantity of $$u$$ and $$v$$ when they come in contact, and voilà! You now stand in presence of a reaction-diffusion equation (RD equation for friends):

$$ \frac{du}{dt} = f(u, v) + c_u \Delta u $$

$$ \frac{dv}{dt} = g(u, v) +c_v \Delta v $$

If we were to interpret an RD equation in human language, we could do it like this:

* $$\frac{du}{dt}$$ is the evolution of quantity $$u$$ over time (more/less rabbits, higher/lower concentration of molecules...)
* $$f(u,v), g(u,v)$$ represent the portion of this evolution that is due to the interaction (rabbits reproducing or getting eaten by foxes, molecules being consumed or produced by a chemical reaction...)
* $$c_u \Delta u$$ is the evolution of quantity $$u$$ over time that is due to diffusion (rabbits arriving from / leaving to nearby cells, covid cases arriving/leaving by plane, etc.)

Boom, that's it. $$f$$ and $$g$$ are the interaction functions: that's where the story will happen. Which story? The story of life and death, of molecules reacting, of survival of the fittest, of a baby zebra's unique stripe pattern: it's entirely up to you. You only need to know one thing: the interaction mechanism between $$u$$ and $$v$$.

For example, using the values given on <a href="https://www.karlsims.com/rd.html" target="_blank">this page</a> for a model simulating diffusion and reaction between two different chemical species (the <a href="https://groups.csail.mit.edu/mac/projects/amorphous/GrayScott/" target="_blank">Gray-Scott model</a>), we get the following simulation :

<div id="prey-sketch" style="text-align: center;">
<section style="display: grid; grid-template-columns: 1fr 1fr 1fr; grid-template-rows: 1fr 2fr 1fr; column-gap: 5%">
<div>
<b> Current Border Conditions </b>
</div>
<div>
<b> Play/Pause </b>
</div>
<div>
<b> Reset </b>
</div>

<div class="p5-button-description">
**Dirichlet**: the world goes beyond the boundaries of the window <br>
**Neumann**: the world stops at the boundaries of the window
</div>
<div class="p5-button-description">
pause or resume the animation
</div>
<div class="p5-button-description">
Reset the grid
</div>

<div id = "prey-conditions-button"></div>
<div id = "prey-stop-button"></div>
<div id = "prey-reset-button"></div>

</section>
</div>
<script src="{{"js/p5-libraries/p5.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"js/p5-libraries/p5.dom.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"js/p5-libraries/p5.sound.js" | relative_url}}" type="text/javascript"></script>
<script async src="{{"js/prey_predator/prey_predator.js" | relative_url}}" type="text/javascript"></script>
<script async src="{{"js/prey_predator/prey_sketch.js" | relative_url}}" type="text/javascript"></script>

Fully blue squares are filled at 100% with chemical species A, and fully orange squares with 100% chemical species B. Intermediate colours mean intermediate concentrations of both A and B. Initially all cells are filled with chemical A, and by clicking you fill a few cells with chemical B, that will then start to spread.

I suggest that you try a few things:
* Start patterns by a single click, on the middle, on the side, in a corner...
* Then try to quickly click in two different spots, close or spread apart.  
* Once a pattern has settled, try disturbing it. Do you manage to make it evolve into a different pattern? How many clicks does it take?

<a href="https://www.karlsims.com/rd.html" target="_blank">Karl Sims</a> does a fantastic job at explaining the reaction functions in the Gray-Scott model, so I won't do it here: I strongly advise that you take 2 minutes to go check his explanation, it's crystal clear. Notice how he spends the first half of the tutorial explaining the reaction and diffusion mechanisms in human-understandable terms, and how it helps us to make sense of each term in the RD equations. Plus, I can only run humble simulations on this website, but on his page you will see the results of simulations at a massive scale, which are much prettier and impressive. It's a very short, excellent read.

# Stability: the emergence of form

So now we know about the diffusion equation, and about the RD equations. About the former, we know that the diffusing quantity eventually completely dissipates or spreads evenly (depending on the boundary conditions). It's nice, but it's not very interesting. About the latter, we gathered some intuition so far :
* a) Some equilibrium states can be found (at some point, the Gray-Scott simulation settled on a pattern)
  * This intuition can be mathematically expressed as $$\{ \frac{du}{dt} = 0, \frac{dv}{dt} = 0 \}$$
* b) Some of these equilibrium states are not homogeneous (the pattern was neither all blue nor all yellow)
  * This intuition can be mathematically expressed as $$\{ \frac{du}{dX} \neq 0, \frac{dv}{dX} \neq 0 \}$$, $$X$$ denoting any spatial variable along which the quantity varies. In our case, $$x$$ and/or $$y$$.
* c) The evolution of $$u$$ and $$v$$ are driven by inner dynamics (more rabbits results in less rabbits, more foxes results in less foxes)
  * This intuition is already mathematically formalized by the presence of the function $$f$$ and $$g$$ in the equations expression.
* d) Some of the non-homogeneous equilibrium states are stable (when slightly perturbed, they eventually get back to equilibrium)
    * We will give mathematical form to this intuition in a moment.

<button class="toggle-button" onclick="show_element('step-back')">Take a step back</button>

<div class="toggle-content" id="step-back" style="display: none;">
At this point it's important to take a step back and have a look at what we're after. Turing's patterns are **stable** states of a dynamical system that are **not** homogeneous. So clearly we're after states that verify the conditions of points a) and b) above. And we are also after states that are stable, which means that if we disturb them, they will eventually get back to normal. You might have noticed that once the Gray-Scott model settled on a pattern, it is very difficult to get it to evolve into a different pattern. You usually have to click repeatedly on a cell over and over until a change settles, and sometimes even mashing your mouse button like a Startcaft II PGM just won't do any difference. Intuitively, we would call such patterns stable: to make them budge, we have to bring a big perturbation.
</div>


Can we translate this idea into mathematic form? If we could, that means that we could probably figure out very fast if a specific dynamical system has some equilibriums, and if so, if they are stable or not. The good news is: we can! To do so, we need to borrow a few ideas from an exciting field of mathematics with a very boring name:

# The theory of linear dynamical systems

In the case of a system of equations of the form:

$$ \frac{du}{dt} = au + bv $$

$$ \frac{dv}{dt} = cu + dv $$

There is an easy way to figure out whether a couple of point $$(u^*, v^*)$$ is a stable equilibrium. If we define a matrix $$ A = \begin{pmatrix} a & b \\ c & d\end{pmatrix}$$, a mathematical result (whose explanation that can be found p.137 of the excellent book <a href="http://www.stevenstrogatz.com/books/nonlinear-dynamics-and-chaos-with-applications-to-physics-biology-chemistry-and-engineering" target="_blank">Non-Linear Dynamics and Chaos - Steven Strogatz</a>) tells us that A has to satisfy two conditions for an equilibrium to be stable (i.e can not be disturbed by a small change in $$u$$ and $$v$$):

$$ \mathrm{Tr}(A) < 0 $$

$$ \det(A) > 0 $$

<small> If you don't know what these mean, have a loot at what the <a href="https://en.wikipedia.org/wiki/Trace_(linear_algebra)" target="_blank"> trace </a> and the <a href="https://en.wikipedia.org/wiki/Determinant" target="_blank"> determinant </a> are! </small>

<button class="toggle-button" onclick="show_element('Strogatz-remark')"> A personal remark</button>

<div class="toggle-content" id="Strogatz-remark" style="display: none;">

**Personal Note**: This book by Steven Strogatz in one of my favorite scientific books ever. It is very well written, with LOTS of diagrams, not too much digressions and all the results are explained in a very clear manner. He takes a lot of real life examples from physics, chemistry and social sciences and draws funny, insightful conclusions about them with basic calculus and linear algebra. I find it to be twice as accessible as most modern scientific texts I've read, while going at least as far. If you are into programming, this book is filled with interesting examples that could make great small programming challenges. By all means, give it a try!

</div>

It turns out that <a href="https://fr.wikipedia.org/wiki/Charles_Gustave_Jacob_Jacobi" target="_blank">someone with a forehead even bigger than mine</a> already developed the perfect tool for our RD equations, in the special case with no diffusion (we will see the complete case a bit later on):

# Meet the Jacobian

$$ J = \begin{pmatrix} \frac{\partial f}{\partial u} & \frac{\partial f}{\partial v} \\
                       \frac{\partial g}{\partial u} & \frac{\partial g}{\partial v}
       \end{pmatrix}_{\substack{u^*, v^*}} $$

Ta-daaa ! This matrix is one of the most powerful tool at our disposal when working with dynamical systems. It might not look like much but it tells us important things: each element of the matrix is a partial derivative, evaluated at a point of equilibrium $$(u^*, v^*)$$.The first term for example, $$\frac{\partial f}{\partial u}$$, tells us about how the function $$f$$ will react if we increase the quantity $$u$$ by a small amount $$du$$ (i.e going from $$u^*$$ to $$u^* + du$$). The sign of this term tells us how $$f$$ will evolve with $$u$$: if it is positive, then increasing $$u$$ will increase $$f$$. If it is negative, increasing $$u$$ will decrease $$f$$. The same logic goes for the 3 other terms of the matrix.

<button class="toggle-button" onclick="show_element('Jacobian-examples')">I want examples</button>

<div class="toggle-content" id="Jacobian-examples" style="display: none">

When we introduced the reaction-diffusion equation, we saw that $$f$$ and $$g$$ can be understood as the change in quantities $$u$$ and $$v$$ that are due to interactions between them. So with that in mind, I can start to interpret the sign of each term of the Jacobian in more concrete terms:

In a sheep/grass model where $$u$$ represents the population of sheeps and $$v$$ the available quantity of grass:
* $$\frac{\partial f}{\partial u} < 0$$ would mean that the sheeps reproduction rate will decrease if their population increases. Since more sheeps means less grass available to eat, reproduction will become harder because of food scarcity.

In a chemical reaction model where $$u$$ represents the concentration of molecule A and $$v$$ the concentration of molecule B:
* $$\frac{\partial f}{\partial v} < 0$$ would mean that the creation of A due to chemical reaction will decrease if the quantity B increases. So if I have more of chemical B, I generate chemical A less fast? That would make sense, if chemical B was an inhibitor of the reaction that produces A, for example.

In an epidemiology model where $$u$$ represents the number of healthy people and $$v$$ the number of covid cases:
* $$\frac{\partial g}{\partial u} > 0$$ would mean that the creation of covid cases due to interaction (contagion + remission) will increase if there are more healthy people around. In this case, more healthy people leave more room for the virus to spread, so more healthy people leads to a faster rate of contagion.

In a model studying the spread of cheaters in a board game, where $$u$$ represents the number of honest players and $$v$$ the number of cheaters:
* $$\frac{\partial g}{\partial v} > 0$$ would mean that the creation of cheaters due to interaction (imitation between players) will increase with the number of cheaters in the game. If I'm honest, and I see that my cheating neighbour is winning, I will start to cheat as well. No reason to play honest when someone else is cheating! The more cheaters are in the game, the more comfortable everyone feels with cheating: the rate of people starting to cheat increases with the number of cheaters in the game.

So the signs of the Jacoban matrix now take a new meaning:
</div>

* The diagonal terms tell us about how each quantity will react if it is disturbed.
  * If a diagonal term is negative, then a disturbance will be "absorbed" by the interaction: more sheeps means less sheeps born per second.
  * If a diagonal term is positive, then a disturbance will be amplified by the interaction: more cheaters means even more cheaters (think of an avalanche).
* The off-diagonal terms tell us about how each quantity will react if the other quantity is disturbed.
    * If an off-diagonal term is negative, then an increase in one quantity will lead to less generation of the other: more chemical B inhibits synthesis of chemical A.
    * If an off-diagonal term is positive, then an increase in one quantity will lead to more generation of the other: more healthy people around mean a faster rate of covid-19 contagion.

Hopefully now you start to see how that tool might help in our quest for stable equilibrium: if we manage to find an equilibrium point $$(u^*, v^*)$$, We can compute the Jacobian matrix at that point and instantly learn a great deal about the behaviour of the system around it. It is not completely clear yet how we will use it, but surely it will prove useful, or I would not have bothered writing all these examples, right?

<br>
<br>
<div style='text-align:right'> <small> (... right?) </small>
</div>
<br>
<br>

Anyway, how can we even find these darned equilibrium points?

### Turing's intuition

You might have noticed that the Jacobian does not include any diffusion term. In every example I wrote, there was no diffusion involved: I took great care to avoid any diffusion, because that's precisely Turing's intuition.

> Such a system, although it may originally be quite homogeneous, may later develop a pattern or structure due to an instability of the homogeneous equilibrium, which is triggered off by random disturbances.
[...]
For if the system originally has no sort of geometrical symmetry but is a perfectly homogeneous and possibly irregularly shaped mass of tissue, it will continue indefinitely to be homogeneous. In practice, however, the presence of irregularities, including statistical fluctuations in the numbers of molecules undergoing the various reactions, will, if the system has an appropriate kind of instability, result in this homogeneity disappearing.
> <p class="quote-author"> Alan Turing </p>

Alan Turing saw what we saw earlier in the Gray-Scott model: mechanisms of diffusion (like heat propagation) coupled to mechanisms of reaction (like prey/predators system, virus contagion or chemical reactions) produce clear patterns out of homogeneity. If you want to impress your crush, you can refer to this phenomenon as **symmetry-breaking** (N.B: this does not work in a physics lab, where this language is common practice. Don't take your crush to a physics lab). The Gray-Scott model starts with homogeneity: a map filled with chemical A. Adding a slight perturbation (a small quantity of chemical B) triggers a process that ends up in a clear pattern of A and B: a stable equilibrium that is not anymore homogeneous.

It is important to notice that what allows the existence of these patterns is actually the coexistence of the 2 mechanisms:
* Without the diffusion terms $$c_u\Delta u$$ and $$c_v\Delta v$$, chemical B would stay in its cell, reach an equilibrium with chemical A there, and would leave behind three constantly yellowish cells where you clicked, nothing more.
* Without the reaction $$f(u,v)$$ and $$g(u,v)$$, chemical B would diffuse homogeneously in the medium (just like heat in the first simulation) and would add a yellow shade to all cells in the media, before eventually vanishing (because of the Dirichlet conditions).

Turing's idea was that starting with a homogeneous equilibrium state (homogeneous = without any diffusion, with the same concentration of $$u$$ and $$v$$ everywhere), adding a perturbation (=increasing the quantity of $$u$$ and/or $$v$$ in a small area) and allowing it to diffuse through the medium would create these typical patterns. In <a href="https://eartiges.github.io/complex-systems/complexity/turing-patterns/p5.js/2021/04/01/Turing-patterns-part-2.html" target="_blank">the next article</a>, we will follow his steps in proving this, and show that there is a third condition on the nature of $$f$$ and $$g$$ for Turing patterns to emerge.
