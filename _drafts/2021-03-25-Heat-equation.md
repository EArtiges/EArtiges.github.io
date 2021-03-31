---
layout: post
title:  "The Heat Equation: call the police and the firemen !"
date:   2021-03-21 11:44:13 +0000
categories: numerical-physics classical-physics turing-patterns p5.js  
summary: Where we learn about what it means to be hot.
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
