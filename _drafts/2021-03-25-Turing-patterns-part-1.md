---
layout: post
title:  "Turing patterns: beautiful hot mess"
date:   2021-03-21 11:44:13 +0000
categories: complex-systems complexity turing-patterns p5.js  
summary: Where we learn about the cost of homophobia, seduction in fishes, and what it means to be hot.
---

# Fourier: any function can be approximated with periodic functions

Find a good animation here, I can't write one. Many other very good explanations of this already exist elsewhere.

# Fourier: Heat Diffusion is just another wave function !

Before diving into the equations, let's take a second to play.

Fourier told us (via a demonstration that I won't repeat here) that the heat diffusion follows the following equation : du/dt = c * d2 u / dx2 . It is possible (via shameless approximations) to simulate the result of such an equation, to help us get a better grasp at how heat diffuses in a material. Here you go:

<div id="heatdiff-sketch" style="text-align: center;">

<section style="display: grid; grid-template-columns: 1fr ; grid-template-rows: 1fr 1fr 1fr; column-gap: 5%">
<div>
<b> Border Conditions </b>
</div>

<div class="p5-button-description">
* Dirichlet: the heat escapes from the material
* Neumann: the heat can not escape the material
</div>

<div id = "conditions-button"></div>

</section>


</div>
<script src="{{"js/p5-libraries/p5.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"js/p5-libraries/p5.dom.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"js/p5-libraries/p5.sound.js" | relative_url}}" type="text/javascript"></script>
<script async src="{{"js/heat_diffusion/heatgrid.js" | relative_url}}" type="text/javascript"></script>
<script async src="{{"js/heat_diffusion/heat_sketch.js" | relative_url}}" type="text/javascript"></script>

Great! So now we gathered some intuition about what happens when we poke something repeatedly with a burning stick and, even better, we managed to do that harmlessly. Now back to our mathematical considerations: can we solve the heat equation and translate our intuition into structured knowledge? Let's try.

Remember that all functions can be approximated by a sum of cos and sin? If I know the heat profile at t=0, then I can express it as a **Big Sum©** of sin and cos, which means that all I really need is the solution of the diffusion equation for sin and cos. Then I can solve the heat equation separately for every sin and cos in the **Big Sum©**, and by summing all individual solutions, I get the global solution!

I apply the following idea: $$ \frac{du}{dt} = c \frac{d^2 u}{dx^2}$$ . In the simplest case, u is $$\sin(\frac{n x \pi}{L}):

$$ d (sin(x, t)) / dt = c * -(n*pi / L)**2 * sin(x) $$

It works very much the same way for cos. Cool ! Since all the functions that I can write can be approximated by a sum of cos and sin, then it means that all these functions will be eigenfunctions of the Laplacian operator. It's a nice by-product, but for practical intents it has only one consequence that matters, and you should keep that in mind:

du = Temperature evolution during a time dt

delta u * dt = c * eigenvalue of u * u * dt.

So the temperature evolution in a segment of size dx during a time dt is equal to c * eigenvalue of u * u * dt ?
Yup.

dt is fixed, so only three things can impact heat diffusion now:
- the value of u
- the eigenvalue of u
- the diffusion factor

For each of these three factors, two things are true:
- The higher their magnitude, the higher the temperature change will occur
- The product of their sign will determine the direction of the heat flux. A positive sign will spread the heat, a negative sign will suck it in.

The value of the temperature and the diffusion factor have fairly straightforward meanings, so I won't detail them now. I woud rather take a look at the eigenvalue of u : (n * pi / L )**2 . First of all, let's ditch the square factor here and look at what's inside. n * pi / L .

* L is a distance.
* n * pi is a number of half-cycles

So sin( n * pi / L ) is a function that executes n half-cycles over a segment of length L. Qualitatively, we see that the magnitude of the eigenvalue is proportional to the number of half-cycles (and therefore, to the number of cycles) executed by the function over a certain distance. This means that the eigenvalue of a function u is INVERSELY proportional to its characteristic scale (physicists call it "its wavelength"). From this, we can draw a mathematical conclusion and the intuition that comes with it:

* Mathematical conclusion: Functions with a higher n (therefore a shorter characteristic length) will diffuse (= evolve towards equilibrium) faster. In other words, functions associated with shorter characteristic scales will fade first, and functions associated with longer characteristic scales will fade last. This is why in the animation above, if you click on two squares relatively close to one another, you will see the two small initial hotspots disappear very fast, but the auras that they leave behind merge and form a larger not-so-hot blob that will live much longer. The typical diameter of a hotspot is 3 squares, and the typical diameter of a lukewarm blob is 5-7 squares. Shorter scale, shorter lifespan.

* Intuition: Areas where the temperature exhibits abrupt changes (big change of temperature over a short distance) will diffuse faster: these areas of abrupt change will tend to get smoothed out first. We can be confident in this intuition because we have seen earlier that these abrupt changes are actually due to high-frequency (= short characteristic length) functions, and we know that these will fade first.

# Mathematical solution

The main trick used in this part is the separation of variables. I looked for a bunch of different places for a justification of this trick: they varied from down-to-earth ("because it works") to tongue-in-cheek ("At the time, many mathematicians argued about the validity of [Fourier's] approach, while he continued to solve many practical problems"), when they even bothered addressing it. The most honest of them I found <a href="https://tutorial.math.lamar.edu/Classes/DE/SeparationofVariables.aspx" target="_blank">here</a>:

<blockquote>
Why? Why did we choose this solution and how do we know that it will work? This seems like a very strange assumption to make. This seems more like a hope than a good assumption.
[...]
Unfortunately, the best answer is that we chose it because it will work.
<p class="quote-author"> -Paul Dawkins </p>
</blockquote>

So we assume $$u(x,t)$$ to be of the form $$u(x,t) = v(x) f(t)$$, which is great because now we get to write:

$$ \frac{df}{dt} v = f c \Delta v $$

which translates to:

v * df/dt = f * c * lambda * v

which amounts to :

v * ( df/dt - f * c * lambda ) = 0 .

Since v is not 0 everywhere, the only solution for this equation to be verified is:

df/dt = f * c * lambda

Rejoice! The glorious exponential has arrived!

So now we know the form of f, and we know the form of v. Which means that we know the general form of u, the evolution of temperature over space and time:

u(x, t) = sum(sin(n*pi/L)) * exp( - c * (n * pi / L)**2 * t ) (with the Dirichlet conditions, because heat has to be 0 at the border. Only way to make that happen is for u to be a sum of functions which are all 0 at the borders: sinuses.)

u(x, t) = sum(sin(n*pi/L)) * exp( - c * (n * pi / L)**2 * t ) (with the Neumann conditions, because heat transfer has to be 0 at the border.  Only way to make that happen is for u' to be a sum of functions which are all 0 at the borders: sinuses, and therefore u has to be a sum of sin integrals: cosinuses.)

Dope! We solved the heat equation.

# What about now?

Well, see, here's the thing: heat is just a particular case. There are MANY other phenomena that can be described by the "Heat Equation", because it embodies a very, very physical process: the spread of a finite quantity (noticed that I said finite, not fixed). Rabbits in Australia, covid in Europe, BTS k-pop song "Dynamite" in all my feel-good playlists (it's THAT good), and even more.

And if you have read <a href="https://eartiges.github.io/complex-systems/complexity/p5.js/2021/03/21/collective-behavior-intro-complex-systems.html" target="_blank">my first article on complex systems</a>, you know that interesting things arise when there are interactions at hand. Specifically, if two quantities (animal species, religions, molecules) were to diffuse and interact with one another, would the situation eventually settle down (= reach an equilibrium)? If yes, what would it look like? In a prey/predator system for example, it is known that a balance exists between the two species: too many rabbits, and the foxes will feast upon them, thus growing in numbers. Too many foxes, and there won't be enough rabbits to eat, thus reducing the fox population.
<blockquote>
More prey - > more predators -> less preys. <br>
More predators -> less preys -> less predators. <br>
<p class="quote-author"> - Mother Nature </p>
</blockquote>

# The reaction-diffusion equations

It turns out that modeling such systems (called dynamical systems) is very straightforward once we understood the heat equation. Here, let me show you:

Step 1 : take the heat equations that model the spread of both quantities over time (the only thing that differs between both these equations is the coefficient c: it controls the speed of the diffusion for each quantity):

$$ \frac{du}{dt} = c_u \Delta u $$

$$ \frac{dv}{dt} = c_v \Delta v $$

Here for example, u could be the population of rabbits and v the population of foxes.

Step 2 : Add an interaction term to explain how $$u$$ and $$v$$ will evolve when they meet.

$$ \frac{du}{dt} = f(u, v) + c_u \Delta u $$

$$ \frac{dv}{dt} = g(u, v) +c_v \Delta v $$

If we were to interpret an equation-diffusion in human language, we could do it like this:

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
<script async src="{{"js/prey_predator/prey_predator.js" | relative_url}}" type="text/javascript"></script>
<script async src="{{"js/prey_predator/prey_sketch.js" | relative_url}}" type="text/javascript"></script>

Fully blue squares are filled at 100% with chemical species A, and fully orange squares with 100% chemical species B. Intermediate colors mean intermediate concentrations of both A and B. Initially all cells are filled with chemical A, and by clicking you fill a few cells with chemical B, that will then start to spread.

I suggest that you try a few things:
* Start patterns by a single click, on the middle, on the side, in a corner...
* Then try to quickly click in two different spots, close or spread apart.  
* Once a pattern has settled, try disturbing it. Do you manage to make it evolve into a different pattern? How many clicks does it take?

<a href="https://www.karlsims.com/rd.html" target="_blank">Karl Sims</a> does a fantastic job at explaining the reaction functions in the Gray-Scott model, so I won't do it here: I strongly advise that you take 2 minutes to go check his explanation, it's crystal clear. Notice how he spends the first half of the tutorial explaining the reaction and diffusion mechanisms in human-understandable terms, and how it helps us to make sense of each term in the reaction-diffusion equations. Plus, I can only run humble simulations on this website, but on his page you will see the results of simulations at a massive scale, which are much prettier and impressive. It's a very short, excellent read.

# Stability: the emergence of form

So now you know about the diffusion equation, and about the reaction-diffusion equations. About the former, we know that the quantity eventually completely dissipates or spreads evenly (depending on the boundary conditions). It's nice, but it's not very interesting. About the latter, we gathered 3 intuitions so far :
* a) Some equilibrium states can be found (at some point, the Gray-Scott simulation settled on a pattern)
  * This intuition can be mathematically expressed as $$\{ \frac{du}{dt} = 0, \frac{dv}{dt} = 0 \}$$
* b) Some of these equilibrium states are not homogeneous (the pattern was neither all blue nor all yellow)
  * This intuition can be mathematically expressed as $$\{ \frac{du}{dX} \neq 0, \frac{dv}{dX} \neq 0 \}$$, $$X$$ denoting any spatial variable along which the quantity varies. In our case, $$x$$ and/or $$y$$.
* c) The evolution of u and v are driven by inner dynamics (more rabbits results in less rabbits, more foxes results in less foxes)
  * This intuition is already mathematically formalized by the presence of the function $$f$$ and $$g$$ in the equations expression.


At this point it's important to take a step back and have a look at what we're after. Turing's patterns are stable states of a dynamical system that are not homogeneous. So clearly we're after the states mentioned in point b) above. And we are also after states that are stable, which means that if we disturb them, they will eventually get back to normal. You might have noticed that once the Gray-Scott model settled on a pattern, it is very difficult to get it to evolve into a different pattern. You usually have to click repeatedly on a cell over and over until a change settles, and sometimes even mashing your mouse button like a Startcaft II PGM just won't do any difference. Intuitively, we would call such patterns stable: to make them budge, we have to bring a big perturbation. We have now a fourth and a fifth intuition about reaction-diffusion equations:

* d) Some of the non-homogeneous equilibrium states are stable (when slightly perturbed, they eventually get back to equilibrium)
  * We will give mathematical form to this intuition in a moment.
* e) Different non-homogeneous stable equilibrium states exist for a same system (with a perturbation big enough, it is still possible to reach a different stable pattern)
  * We will give mathematical form to this intuition in a moment.

Can we translate this idea into mathematic form? If we could, that means that we could probably figure out very fast if a specific dynamical system has some equilibriums, and if so, if they are stable or not. The good news is: we can! To do so, we need to borrow a few ideas from an exciting field of mathematics with a very boring name:

# The theory of linear dynamical systems

In the case of a system of equations of the form:

$$ \frac{du}{dt} = au + bv $$

$$ \frac{dv}{dt} = cu + dv $$

There is an easy way to figure out whether a couple of point $$(u^*, v^*)$$ is an equilibrium. If we define a matrix $$ A = \begin{pmatrix} a & b \\ c & d\end{pmatrix}$$, a mathematical result (whose explanation that can be found p.137 of the excellent book <a href="http://www.stevenstrogatz.com/books/nonlinear-dynamics-and-chaos-with-applications-to-physics-biology-chemistry-and-engineering" target="_blank">Non-Linear Dynamics and Chaos - Steven Strogatz</a>) tells us that A has to satisfy two conditions for an equilibrium to be stable (i.e can not be disturbed by a small change in $$u$$ and $$v$$):

$$ \mathrm{Tr}(A) < 0 $$

$$ \det(A) > 0 $$

<small> If you don't know what these mean, have a loot at what the <a href="https://en.wikipedia.org/wiki/Trace_(linear_algebra)" target="_blank"> trace </a> and the <a href="https://en.wikipedia.org/wiki/Determinant" target="_blank"> determinant </a> are! </small>

**Personal Note**: This book by Steven Strogatz in one of my favorite scientific books ever. It is very well written, with LOTS of diagrams, not too much digressions and all the results are explained in a very clear manner. He takes a lot of real life examples from physics, chemistry and social sciences and draws funny, insightful conclusions about them with basic calculus and linear algebra. I find it to be twice as accessible as most modern scientific texts I've read, while going at least as far. If you are into programming, this book is filled with interesting examples that could make great small programming challenges. By all means, give it a try!

It turns out that <a href="https://fr.wikipedia.org/wiki/Charles_Gustave_Jacob_Jacobi" target="_blank">someone with a forehead even bigger than mine</a> already developed the perfect tool for our RC equations, in the special case with no diffusion (we will see the complete case a bit later on):

# Meet the Jacobian

$$ J = \begin{pmatrix} \frac{\partial f}{\partial u} & \frac{\partial f}{\partial v} \\
                       \frac{\partial g}{\partial u} & \frac{\partial g}{\partial v}
       \end{pmatrix}_{\substack{u^*, v^*}} $$

Ta-daaa ! This matrix is one of the most powerful tool at our disposal when working with dynamical systems. It might not look like much but it tells us important things: each element of the matrix is a partial derivative, evaluated at a point of equilibrium $$(u^*, v^*)$$.The first term for example, $$\frac{\partial f}{\partial u}$$, tells us about how the function $$f$$ will react if we increase the quantity $$u$$ by a small amount $$du$$ (i.e going from $$u^*$$ to $$u^* + du$$). The sign of this term tells us how $$f$$ will evolve with $$u$$: if it is positive, then increasing $$u$$ will increase $$f$$. If it is negative, increasing $$u$$ will decrease $$f$$. The same logic goes for the 3 other terms of the matrix.

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

Alan Turing saw what we saw earlier in the Gray-Scott model: mechanisms of diffusion (like heat propagation) coupled to mechanisms of reaction (like prey/predators system, virus contagion or chemical reactions) produce clear patterns out of homogeneity. The Gray-Scott model starts with homogeneity: a map filled with chemical A. Adding a slight perturbation (a small quantity of chemical B) triggers a process that ends up in a clear pattern of A and B: a stable, equilibrium state that is not uniform anymore.

It is important to notice that what allows the existence of these patterns is actually the coexistence of the 2 mechanisms:
* Without the diffusion $$c_u\Delta u$$ and $$c_v\Delta v$$, chemical B would stay in its cell, reach an equilibrium with chemical A there, and would leave behind three constantly yellowish cells where you clicked, nothing more.
* Without the reaction $$f(u,v)$$ and $$g(u,v)$$, chemical B would diffuse homogeneously in the medium (just like heat in the first simulation) and would add a yellow shade to all cells in the media, before eventually vanishing (because of the Dirichlet conditions).

Turing's idea was that starting with a homogeneous equilibrium state (homogeneous = without any diffusion, with the same concentration of $$u$$ and $$v$$ everywhere), adding a perturbation (=increasing the quantity of $$u$$ and/or $$v$$ in a small area) and allowing it to diffuse through the medium would create these typical patterns. We will now follow his steps in proving this.

### The battle plan

We have now seen all the ideas that we will use in our quest for Turing patterns. The time has come to put our battle plan together and figure out exactly what it is that we are about to do.

What are we after, really? We know that Turing patterns are a non-homogeneous stable solution of the RC equation, and that they arise from a perturbation in a homogeneous landscape. We want to know the conditions for such a perturbation to survive for long times (i.e not to end up like heat on a metal plate in the first simulation of this article, but rather like the beautiful patterns in the Gray-Scott model in the second simulation).

1. The first step will be to look for a solution of the RC equations around a homogeneous equilibrium: can we express $$u(X,t)$$ and $$v(X,t)$$ under a tractable form? We will see that indeed we can.
2. Once we have the general solution, we will look into the conditions of stability of the perturbation, expressed as a **Big Sum©**: which periodicities do not decay to 0 for long times? Such periodicities are non-homogeneous stable solutions of the RC equations: since they are not flat, it means they draw a pattern, and since they're stable, it means the pattern is here to stay!
3. In doing so, we will gain even more insight into the conditions for a Turing pattern to emerge. At this point we will be ready for a full example.

I have tried to keep the math in check so far, but now there's no sneaking around, no fancy intuitions, no jedi mind tricks that can keep us safe any longer. There is no way but through.

### The quest for Turing patterns

#### Part I. Solving the diffusion-reaction equations: a real gun show

Our initial system of RC equations is:

$$ \frac{du}{dt} = f(u, v) + c_u \Delta u $$

$$ \frac{dv}{dt} = g(u, v) + c_v \Delta v $$

A Turing pattern is a stable non-homogeneous equilibrium emerging from a stable homogeneous equilibrium due to a perturbation. Initially, our system is therefore completely uniform, and $$u$$ and $$v$$ are constant across the whole domain: they are equal to $$u^*$$ and $$v^*$$ everywhere. Since $$u$$ and $$v$$ are constant everywhere, there is no diffusion. We get to write $$\Delta u\vert_{u^*} = 0 $$ and $$\Delta v\vert_{v^*} = 0 $$. From this, it immediately comes that, since $$ \frac{du}{dt}\vert_{u^*}=0 $$ and $$ \frac{dv}{dt}\vert_{v^*}=0 $$ (because we are in a **stable** equilibrium), $$f(u^*, v^*)=0$$ and $$g(u^*, v^*)=0$$. No diffusion, no reaction, no evolution. Quite like the plot of Justice League if you ask me.

Now is the time to bring out the **Big Guns©** and make these two baddies talk. The first **Big Gun©** is called <a href="https://en.wikipedia.org/wiki/Linearization" target="_blank">linearization</a> (which uses another **Big Gun©** that you might have heard about if you ever took a calculus class: <a href="https://en.wikipedia.org/wiki/Taylor_series" target="_blank">Taylor expansion</a>).

It's quite a straightforward tool. It states that for any function $$h$$ that can be derived on $$x$$:

$$ h(x + dx) \approx h(x) + \frac{dh}{dx} dx $$

<small>(If you look at it for long enough, you will eventually realize that it's simply the derivation formula in disguise.)</small>

In the previous equation, $$dx$$ is a small change in $$x$$: we will call it a **perturbation**. We can apply the same principle to our set of equations: if we slightly modify the concentrations of $$u$$ and $$v$$ around the equilibrium, then we get to learn how our system behaves around that point (sort of like what we did with the Jacobian, except this time diffusion is taken into account). I will only detail the calculations for $$u$$ but the process is the exact same for $$v$$. So let's call $$u_p$$ and $$v_p$$ our perturbations, I have:

$$ \frac{d (u + u_p)}{dt}\vert_{u^*} = f(u^* + u_p, v^* + v_p) + c_u \Delta (u + u_p)\vert_{u^*} $$

Using linearization on $$f$$, and since for all functions $$a$$ and $$b$$ I have $$\frac{d(a + b)}{dx} = \frac{da}{dx} + \frac{db}{dx}$$, the above equation becomes (all terms evaluated at the point $$(u^*, v^*)$$):

$$ \frac{du}{dt} + \frac{d u_p}{dt} = f(u^*, v^*) + c_u \Delta u + \frac{\partial{f}}{\partial{u_p}}u_p + \frac{\partial{f}}{\partial{v_p}} v_p + c_u \Delta \delta u $$

Since $$ \frac{du}{dt}\vert_{u^*} = 0$$, $$f(u^*, v^*)=0$$, and $$ \Delta u \vert_{u^*} = 0$$, the above equation becomes:

$$ \frac{d u_p}{dt} = \frac{\partial{f}}{\partial{u_p}}u_p + \frac{\partial{f}}{\partial{v_p}}v_p + c_u \Delta u_p  \qquad \text{- eq. 8}$$

This last equation looks strangely familiar: it still has a time derivative on one side, a Laplacian on the other, and a bunch of interaction terms... *Gasp* ! It's another reaction-diffusion equation! Except that this time, it tells me about the propagation of the perturbation $$u_p$$ we brought. What we want to know is: will this perturbation disappear (and in doing so, bring us back to homogeneity and eternal flatness), or is it here to stay (and in this case, take us to a new equilibrium, a pattern)? For this we need to solve this new equation and get a proper expression for $$u(X, t)$$ and $$v(X, t)$$, there's no escape.

For this, we'll call a second **Big Gun©**: the Fourier Series and their variable separation trick, like we saw in the first half of the article. We will assume that the perturbation we just introduced can be expressed as a **Big Sum©** like so:

$$u_p(X, t) = a_0 + \sum_n \alpha_n(t) \omega_n(X) \qquad \text{- eq. 9.1}$$

$$v_p(X, t) = a_0 + \sum_n \beta_n(t) \omega_n(X) \qquad \text{- eq. 9.2}$$

I choose to work with Dirichlet boundary conditions, so there will be only $$\sin$$ in the sum (it would have been only $$cos$$ with Neumann conditions, but the rest of the process would have been the same):

$$ \omega_n(X) = \sin(\frac{n \pi X}{L})$$

It's a reasonable assumption to make as long as our systems are physically bounded in space and in real value: a valley has a finite surface and can only contain a finite amount of foxes and rabbits, same for a cell and chemical concentrations etc. Reminding us of how we solved the Heat equation, introducing eqs. 9.x in eq. 8 and focusing on a single value of $$n$$ (i.e a single characteristic length) eventually results in:

$$ \frac{d \alpha_n }{dt} = \frac{\partial{f}}{\partial{u_p}}\alpha_n + \frac{\partial{f}}{\partial{v_p}}\beta_n + c_u \lambda_n \alpha_n $$

$$ \frac{d \beta_n }{dt} = \frac{\partial{g}}{\partial{u_p}}\alpha_n + \frac{\partial{g}}{\partial{v_p}}\beta_n + c_u \lambda_n \beta_n $$

I removed the $$(t)$$ to make it more digest, but we should not forget that $$\alpha_n$$ and $$\beta_n$$ are functions of time: they are precisely the functions that we want to know about. If they tend to 0 for long times, then the spatial variations associated with characteristic length $$n$$ are not viable and will eventually disappear (remember how abrupt variations of temperature tend to disappear first because of diffusion: same idea, except now it's diffusion + reaction). We are interested in the values of $$n$$ that don't result in $$\alpha_n$$ and $$\beta_n$$ to tend to 0: these values of $$n$$, that are the ones that survive indefinitely, are contained in the mathematical expressions of the stable patterns. Can we figure out what they are? We're almost there!

Time to call for the third **Big Gun©**: the vectorization of the previous system of equations. It's basically considering both the previous equations as a single equation that can be expressed in vector form. It looks like this:


$$\frac{d}{dt}
\begin{pmatrix} \alpha_n \\ \beta_n \end{pmatrix} =
\begin{pmatrix}
\frac{\partial f}{\partial u_p} & \frac{\partial f}{\partial v_p} \\
\frac{\partial g}{\partial u_p} & \frac{\partial g}{\partial v_p}
\end{pmatrix} \bullet
\begin{pmatrix}
\alpha_n \\ \beta_n
\end{pmatrix} +
\lambda_n \begin{pmatrix}
c_u  & 0 \\ 0 & c_v
\end{pmatrix} \bullet
\begin{pmatrix}
\alpha_n \\ \beta_n
\end{pmatrix}
$$

Pretty cool, uh? You can verify, by developing the dot products, that the first dimension of this vectorial equation is indeed the first equation of our system. Same thing for the second dimension and the second equation. You might have recognized our old friend the Jacobian in the middle. By factorizing and setting $$D = \begin{pmatrix} c_u  & 0 \\ 0 & c_v \end{pmatrix}$$, the diffusion matrix, we get the following nicer expression:

$$\frac{d}{dt}
\begin{pmatrix} \alpha_n \\ \beta_n \end{pmatrix} =
( J + \lambda_n D) \bullet \begin{pmatrix} \alpha_n \\ \beta_n \end{pmatrix}
$$

And just like that, we found an expression of the type $$\frac{da}{dt} = A a $$, whose solutions are well known: $$a(t) = C\exp(At) $$. Let's plug that in:

$$\begin{pmatrix} \alpha_n(t) \\ \beta_n(t) \end{pmatrix} =
\begin{pmatrix} \alpha_0 \\ \beta_0 \end{pmatrix} \exp( [J + \lambda_n D]t )
$$

and final step, let's bring back in the spatial dimension with $$\omega_n$$ :

$$\begin{pmatrix} \alpha_n\omega_n \\ \beta_n\omega_n \end{pmatrix} =
\begin{pmatrix} \alpha_0\omega_n \\ \beta_0\omega_n \end{pmatrix} \exp( [J + \lambda_n D]t )
$$

<small> Just like before I removed the explicit expression of variables but $$\alpha_n$$ and $$\beta_n$$ are functions of time, $$\omega_n$$ is a function of space and $$\alpha_0, \beta_0$$ are just constants that describe the amplitude of the perturbation at $$t=0$$. </small>

Phew! We're there. Battle plan, step 1: check ! We see that the time evolution of each frequency component of $$u_p$$ and $$v_p$$ follows an exponential evolution, which depends on its eigenvalue $$\lambda_n$$. Our destiny is now in the hands of the content of the exponential: $$ J + \lambda_n D $$. Will this expression result in an exponential decay that will eventually kill the term associated to $$n$$ in the **Big Sum©**? Or will it result in a non-zero limit for longer times, in which case $$sin(\frac{n \pi}{L})$$ will live forever in the **Big Sum©**, and be a part of the glorious, ever-sought after Turing pattern?

#### Part II. Stability Analysis: A balancing act

To help us answer this, we'll invoke the Jacobian. Remember that Turing's intuition is to start with a stable homogeneous equilibrium (so, no diffusion since it's uniformly flat). Therefore around $$(u^*,v^*)$$, the conditions that we borrowed from the theory of linear dynamical systems are met, and since there is no diffusion, they simply translate to:

$$ \mathrm{Tr}(J) < 0 $$

$$ \det(J) > 0 $$

Our hope is that, by adding a perturbation that can diffuse, we get to trigger an instability around $$(u^*,v^*)$$ that would take us to a different, non-homogeneous equilibrium (a Turing pattern!). So really, we are trying to show that by adding the diffusion term, now at least one of the following conditions is false:

$$ \mathrm{Tr}(J + \lambda_n D) < 0 $$

$$ \det(J + \lambda_n D) > 0 $$

Since $$\lambda_n$$ is negative or null (remember: $$\lambda_n = - (\frac{n \pi}{L})^2$$) and since the sum of the diagonal terms of the Jacobian are negative (by virtue of $$ \mathrm{Tr}(J) < 0 $$), the first condition is always true (dammit!). So we need the second to be true: and that's it. Battle plan, step 2: check ! We now have a set of three conditions to be satisfied at once: two conditions on the Jacobian that have to be satisfied before the diffusion process even starts, and a third one without which all the periodicities $$n$$ in the **Big Sum©** will eventually disappear, leaving us with a homogeneous (= uniformly  flat) solution:

$$ \mathrm{Tr}(J) < 0 $$

$$ \det(J) > 0 $$

$$ \det(J + \lambda_n D) > 0 $$

But let's not stop here. Let's have a deeper look at that third condition and what it means for the Jacobian: there is deep insight to be gained from it. Let's start by developping it:

$$ \det(J + \lambda_n D) =  (\frac{\partial{f}}{\partial{u}} + \lambda_n c_u)(\frac{\partial{g}}{\partial{v}} + \lambda_n c_v) -
\frac{\partial{g}}{\partial{u}} \frac{\partial{f}}{\partial{v}}
$$

The previous expression is a polynomial of degree 2 in $$\lambda_n$$. We desperately need this polynomial to be negative at least for some value of $$\lambda_n$$. For this, we develop the polynomial and we notice that its coefficient in $$\lambda_n^2$$ is $$c_u c_v$$, which is always positive in our case. Therefore the graph of this polynomial opens upward, and we need at least its minimum to be negative, else all hope it lost. for a polynomial $$ax^2 + bx + c = 0$$, the minimum is reached in $$x_{min} = - \frac{b}{2a}$$, which yields:

$$\lambda_{min} = - \frac{\frac{\partial{f}}{\partial{u}} c_v + \frac{\partial{g}}{\partial{v}} c_u }{2 c_u c_v} $$

Since all $$\lambda_n$$ are negative, the numerator of this expression has to be positive. Let's keep that in mind, plug that back in the determinant formula and hope that the value is negative:

$$ \det(J + \lambda_{min} D) = \det(J) - \frac{(\frac{\partial{f}}{\partial{u}} c_v + \frac{\partial{g}}{\partial{v}} c_u)^2}{4 c_u c_v} $$

We know that $$det(J)>0$$, and we need the above expression to be negative, which translates to:

$$ 2 \sqrt{c_u c_v \det(J)} < \frac{\partial{f}}{\partial{u}} c_v + \frac{\partial{g}}{\partial{v}} c_u$$

We can't go much further from here. Let's state again the three conditions here, with the third one written under this new form:

$$ \mathrm{Tr}(J) < 0 $$

$$ \det(J) > 0 $$

$$ \frac{\partial{f}}{\partial{u}} c_v + \frac{\partial{g}}{\partial{v}} c_u > 2 \sqrt{c_u c_v \det(J)} $$

The first condition and the third condition, taken together, tell us that we need $$\frac{\partial{f}}{\partial{u}}$$ and $$\frac{\partial{g}}{\partial{v}}$$ to be of opposite signs: We need their sum to be negative so at least one has to be negative, but we also need their sum weighted by their diffusion coefficients to be positive, so at least one of them has to be positive.

The second condition on the other hand, implies that we need the off-diagonal terms of $$J$$ to be of opposite signs as well: for $$\sqrt{\det(J)}$$ to exist, we need $$\det(J)$$ to be positive. $$\det(J)$$ is the product of the diagonal terms minus the product of the off-diagonal terms, and we just saw that the product of the diagonal terms is negative. Therefore the only solution for $$\det(J)$$ to be positive is for the off-diagonal terms to be of opposite signs.

So in order to see a Turing's pattern appear, we need the signs of the Jacobian matrix to be one of 4 combinations:

$$
\begin{pmatrix} + & - \\ + & -\end{pmatrix} \quad
\begin{pmatrix} + & + \\ - & -\end{pmatrix} \quad
\begin{pmatrix} - & + \\ - & +\end{pmatrix} \quad
\begin{pmatrix} - & - \\ + & +\end{pmatrix}
$$

It's a very elegant result, that tells us that for a Turing pattern to emerge, we need one of the two quantities to be a self-activator (more of $$u$$ means increased generation of $$u$$, like the cheaters) and the other to be a self-inhibitor (more of $$v$$ means decreased generation of $$v$$, like the sheeps). Independently, we need one quantity to activate the other (more $$u$$ means an increased generation of $$v$$, like healthy people and covid cases) and one quantity to inhibit the other (more $$v$$ means slower generation of $$u$$, like the chemical B that inhibits chemical A). All combinations of these two conditions are possible, each corresponding to a specific matrix above.

# Part III. Endgame: trials of the pattern

Take a deep breath, go have a walk, have a drink of water: we did it. We just built our first lightsaber: the trio of conditions for Turing patterns to emerge. Now, it's time that we put it to the test and go all chop-chop with it. In <a href="https://people.maths.ox.ac.uk/maini/PKM%20publications/184.pdf" target="_blank"> this paper </a> from Page et al., a trio of researchers give us a nice example to work with: the Gierer-Meinhardt model. They write it under the following form:

$$ \frac{du}{dt} = 5 +\frac{5u^2}{v} - 10u + c_u \Delta u$$

$$ \frac{dv}{dt} = 5u^2 - 20v + c_v \Delta v$$

We will put our methodology to the test: by testing our three conditions on this system of equations around a homogeneous equilibrium, we will bring a perturbation and look for the periodicities $$n$$ that can survive the diffusion process and establish a new non-homogeneous equilibrium (i.e a Turing pattern).

#### Step 1. Find a homogeneous equilibrium

Remember: homogeneous means flat everywhere, so no diffusion. And equilibrium means $$\frac{dv}{dt}=\frac{du}{dt}=0$$. Therefore we are looking for the values $$(u^*, v^*)$$ that satisfy:

$$ 5 +\frac{5u^2}{v} - 10u = 0 $$

$$ 5u^2 - 20v = 0 $$

I won't develop the calculations here; it's your lightsaber after all! We find $$u^* = \frac{10}{4}$$ and $$v^* = \frac{25}{16}$$.

#### Step 2. Check that this homogeneous equilibrium is stable

The Jacobian evaluated at $$(u^*, v^*)$$ is:

$$ J = \begin{pmatrix} 6 & -5 \times 2.56 \\ 25 & -20 \end{pmatrix} $$

Bingo! Diagonal terms are of opposite signs (and so are the off-diagonal terms): we are looking at an inhibitor-activator system. It is worth our time pursuing the calculations. The first and second conditions on the Jacobian are met:

$$ \mathrm{Tr}(J) = 6 - 20 < 0 $$

$$ \det(J) = -120 + 25 \times 5 \times 2.56 > 0 $$

#### Step 3. Bring a perturbation and check if and how it can break the homogeneous equilibrium.

So $$(u^*, v^*)$$ is a stable, homogeneous equilibrium. Small perturbations are meant to me absorbed by it and it should, in theory, be able to maintain itself indefinitely. That is, unless we behave very inappropriately and bring a perturbation containing a periodicity $$n$$ that breaks this equilibrium (i.e that verifies the third condition):

$$ \det(J + \lambda_n D) < 0 $$

With $$ D = \begin{pmatrix} c_u & 0 \\ 0 & c_v \end{pmatrix} $$. Developing the previous inequation leads to:

$$ c_v c_u n^4 + 20 c_u n^2 - 6 c_v n^2 + 200 < 0 $$

This looks inconvenient to solve. Page and al., who have several tricks up their sleeves, get to the following expression by defining $$c_v = \alpha c_u$$ and $$N = n^2$$:

$$ \alpha ( c_u N )^2 + c_u N (20 - 6 \alpha) + 200 < 0 \qquad \text{ - eq.10 }$$

#### Step 4. Check the condition for a value of $$n$$ to survive

Ah-ha ! So now we are left with a condition for the survival of periodicity $$n$$ that only depends on $$n$$, $$c_u$$ and $$\alpha$$. So if we decide that we want a certain periodicity $$n$$ to survive, we need the values of $$c_u$$ and $$\alpha$$ to satisfy the previous condition. We can re-arrange the previous expression to become:

$$ \alpha < 20 \frac{ c_u N + 10 }{c_u N (6 - c_u N)} $$

The thing is, we also need both $$c_u$$ and $$c_v$$ to be positive. So we need $$6 - c_u N $$ in the expression above to be strictly positive, which means $$ c_u < \frac{6}{n^2}$$. And remember not to call divine wrath upon us: we also need $$c_u \neq 0$$ and $$c_u \neq \frac{6}{N}$$ to avoid dividing by zero.

So for example, if we want a Turing pattern of periodicity $$n=3$$, we need both:

$$ \alpha < 20 \frac{ 9 c_u  + 10 }{9 c_u (6 - 9 c_u )} \qquad \text{&} \qquad  c_u \in ]0, \frac{6}{9}[$$

#### Step 5. Rejoice !

<div id="gierer-sketch" style="text-align: center;">
<section style="display: grid; grid-template-columns: 1fr 1fr 3fr; grid-template-rows: 1fr 1fr 1fr 1fr 1fr; column-gap: 5%; align-items:center">

<div>
<b> Current Border Conditions </b>
</div>
<div id = "gierer-conditions-button" style="vertical-align:center"></div>
<div class="p5-button-description" style="text-align:left">
**Dirichlet**: the world goes beyond the boundaries of the window <br>
**Neumann**: the world stops at the boundaries of the window
</div>


<div>
<b> n Slider </b>
</div>
<div id = "gierer-slider"></div>
<div class="p5-button-description" style="text-align:left">
$$n$$: tune the value of $$\alpha$$ and $$c_u$$ to allow periodicity $$n$$ to take over
</div>

<div>
<b> Play/Pause </b>
</div>
<div id = "gierer-stop-button"></div>
<div class="p5-button-description" style="text-align:left">
pause or resume the animation
</div>

<div>
<b> Homogeneous reset </b>
</div>
<div id = "gierer-homoG-reset"></div>
<div class="p5-button-description" style="text-align:left">
Reset the grid to a homogeneous stable equilibrium.
</div>

<div>
<b> Random reset </b>
</div>
<div id = "gierer-random-reset"></div>
<div class="p5-button-description" style="text-align:left">
Reset the grid to random values of u and v averaged around the homogeneous stable equilibrium.
</div>

</section>
</div>
<script async src="{{"js/Gierer_Meinhardt/gierer_lib.js" | relative_url}}" type="text/javascript"></script>
<script async src="{{"js/Gierer_Meinhardt/gierer_sketch.js" | relative_url}}" type="text/javascript"></script>













<br>
