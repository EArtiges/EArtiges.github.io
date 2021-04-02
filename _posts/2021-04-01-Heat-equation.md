---
layout: post
title:  "The Heat Equation: call the police and the firemen ! (Turing patterns part 0/2)"
date:   2021-04-01 11:44:13 +0000
categories: numerical-physics classical-physics turing-patterns p5.js  
summary: Where we learn about what it means to be hot.
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


This article is the first of a series of 3 on the topic of Turing patterns. It is very much an introductory one, where I don't touch anything complexity-related; I merely sketch out the main steps in solving the diffusion equation in 1D using Fourier series, because it will prove useful when solving reaction-diffusion equations where Turing patterns can appear. The math is quick and not very rigorous (for example, I won't spend any time telling you all about the assumptions that have to be made for Fourier series to be applicable, that sort of things); more detailed and specific texts exist for the avid reader.

<hr style="border:0; border-top: dotted; margin:30px">
> This series of articles is dedicated to <a href="https://unizar.academia.edu/CarlosGraciaLazaro" target="_blank">Carlos Gracia Lázaro</a> and <a href="https://fmc0.unizar.es/people/floria/" target="_blank">Mario Floria</a>, who were both gentle, masterful and inspiring mentors to me. They pointed me towards the elegance of linear systems, and I grew better a scientist thanks to their guidance. 
<hr style="border:0; border-top: dotted; margin:30px">

Turing patterns is a fascinating phenomenon that gives birth to a plethora of designs found in nature, like fish stripes or chemical stability regions. As complex systems amateurs, it is very natural that we want to know more about them: where do they arise from? Can we figure out a set of conditions for their existence? etc.

The first step in our journey takes us back to the 19th century, when the problem of diffusion was first solved by a certain <a href="https://en.wikipedia.org/wiki/Joseph_Fourier" target="_blank">Joseph Fourier</a>.

# Fourier series: any function can be approximated with periodic functions

<a href="https://www.youtube.com/watch?v=r6sGWTCMz2k" target="_blank">3Blue1Brown</a> is a genius mathematics channel that explains the idea behind Fourier series far better than I ever could. If you are interested in not taking everything I will tell you at face value (and believe me, you shouldn't), then I strongly advise that you go and watch this video before proceeding. It is much clearer than any math class I ever had, and it will provide you with mathematical and physical knowledge that **will** prove useful eventually (Fourier series are omnipresent in science, from acoustics to music, from heat to signal treatment, from electronics to graph theory, from geology to astronomy...) By checking this out, you're doing yourself a massive service.

The main mathematical point is that for any continuous function $$u$$ defined over a closed interval $$[0, L]$$ we get to write:

$$u(x) = \sum_n A_n\sin(\frac{n\pi x}{L}) + B_n\cos(\frac{n\pi x}{L}) \qquad \forall n \in [0, +inf]$$

# Heat Diffusion is just another wave function !

Before diving into the equations, let's take a second to play.

Fourier told us (via a demonstration that I won't repeat here) that the heat diffusion follows the following equation:

$$ \frac{du}{dt} = c \frac{\partial^2u}{\partial x^2} $$

It basically states:

> the heat $$u$$ contained in a teeny-tiny cube of material (a cell) increases or decreases as a function of the heat contained in the adjacent cells. If the neighbouring cells contain more heat than a cell $$A$$, they will pour their heat into it until cell $$A$$ and its neighbours contain the exact same amount of heat. The heat flows from one cell to another at rate $$c$$."
> <p class="quote-author"> -The Heat Equation </p>

It is possible (via shameless approximations) to simulate the behaviour of such an equation, to help us get a better grasp at how heat diffuses in a material. In the below simulation, a blue cell is completely cold and a red cell is totally hot. Try the heat equation yourself (click somewhere to warm things up!):

<div id="heatdiff-sketch" style="text-align: center;">

<section style="display: grid; grid-template-columns: 1fr ; grid-template-rows: 1fr 1fr 1fr; column-gap: 5%">
<div>
<b> Boundary Conditions </b>
</div>

<div class="p5-button-description">
* **Dirichlet**: the heat escapes from the material
* **Neumann**: the heat can not escape the material
</div>

<div id = "conditions-button"></div>

</section>


</div>
<script src="{{"js/p5-libraries/p5.js" | relative_url}}" type="text/javascript"></script>
<script async src="{{"js/heat_diffusion/heatgrid.js" | relative_url}}" type="text/javascript"></script>
<script async src="{{"js/heat_diffusion/heat_sketch.js" | relative_url}}" type="text/javascript"></script>

Great! So now we gathered some intuition about what happens when we poke something repeatedly with a burning stick and, even better, we managed to do that harmlessly. Now back to our mathematical considerations: can we solve the heat equation and translate our intuition into structured knowledge? Let's try.

# Separation of variables: Divide and conquer

The main trick used in this article is the separation of variables, which means that we will assume $$u(x,t) = v(x) f(t)$$. It's great because it allows us to solve the time-dependent and space-dependent parts of the equation separately. I looked for a bunch of different places for a justification of this trick: they varied from down-to-earth ("because it works") to tongue-in-cheek ("At the time, many mathematicians argued about the validity of [Fourier's] approach, while he continued to solve many practical problems"), when they even bothered addressing it. The most honest of them I found <a href="https://tutorial.math.lamar.edu/Classes/DE/SeparationofVariables.aspx" target="_blank">here</a>:

<blockquote>
Why? Why did we choose this solution and how do we know that it will work? This seems like a very strange assumption to make. This seems more like a hope than a good assumption.
[...]
Unfortunately, the best answer is that we chose it because it will work.
<p class="quote-author"> -Paul Dawkins </p>
</blockquote>

So we assume $$u(x,t)$$ to be of the form $$u(x,t) = v(x) f(t)$$, which will make our life much easier.

# The space dependence: where Fourier was right

<button class="toggle-button" onclick="show_element('space-demo')">Show me the steps</button>

<div class="toggle-content" id="space-demo" style="display: none;">

Remember that <a href="https://www.youtube.com/watch?v=r6sGWTCMz2k" target="_blank">all functions can be approximated by a sum of cos and sin</a>? If I know how the heat is distributed in a piece of material at a certain time $$t$$, then I can express this heat distribution as a **Big Sum©** of $$\sin$$ and $$\cos$$:

$$u(x, t) = \sum_n u_n(x, t) = \sum_n f_n(t) \omega_n(x) $$

Where $$\omega_n(x) = A_n\sin(\frac{n\pi x}{L}) + B_n\cos(\frac{n\pi x}{L}) $$

This is really convenient because the Heat Equation is a linear equation, which means that if a function $$h(x,t) = f(x, t) + g(x, t)$$ is solution of the Heat equation, then $$f$$ and $$g$$ are also solutions of the heat equation on their own. Which means that all I really need is to solve the diffusion equation for $$\sin$$ and $$\cos$$. Then I have the individual solution for every term in the **Big Sum©**, and by summing all these individual solutions, I get the global solution!

Let's try:

$$ \frac{df_n}{dt}\omega_n = c f_n \Delta (A_n\sin(\frac{n\pi x}{L}) + B_n\cos(\frac{n\pi x}{L})) $$

We know that $$\frac{\partial^2 \sin(ax)}{\partial x^2} = - a^2 \sin(ax) $$ and the same goes true for for $$\cos$$. Therefore:

$$ \frac{df_n}{dt}\omega_n = - c (\frac{n\pi}{L})^2 f_n\omega_n $$

Which is really the same as:

</div>

$$ \frac{du_n}{dt}= - c (\frac{n\pi}{L})^2 u_n $$

$$dt$$ is fixed, so only three things can impact heat diffusion now:
- the value of $$u_n$$, i.e the temperature at the location $$x$$ and time $$t$$;
- the value of $$n$$;
- the diffusion factor $$c$$;

The higher the magnitude of any of these three factors, the faster the temperature change will occur.

The value of the temperature and the diffusion factor have fairly straightforward meanings, so I won't detail them now. I would rather take a look at $$\lambda_n = - (\frac{n \pi}{L})^2$$ . Let's ditch the minus and the square factor, and look at what's inside.

* $$L$$ is a distance.
* $$n$$ is a number of half-cycles

So $$ \sin(\frac{n \pi}{L})$$ is a function that executes $$n$$ half-cycles over a segment of length $$L$$. Qualitatively, we see that the magnitude of $$\lambda_n$$ is proportional to the number of half-cycles (and therefore, to the number of cycles) executed by the function over a certain distance. This means that $$\lambda_n$$ is INVERSELY proportional to the length of the cycle that it generates (physicists call this length the **wavelength**). From this, we can draw a mathematical conclusion and the intuition that comes with it:

* **Mathematical conclusion**: Functions with a higher $$n$$ (therefore a shorter wavelength) will diffuse (i.e evolve towards equilibrium, become flat, disappear) faster. In other words, functions associated with shorter wavelength will fade first, and functions associated with longer wavelength will fade last. This is why in the animation above, if you click on two squares relatively close to one another, you will see the two small initial hotspots disappear very fast, but the auras that they leave behind merge and form a larger not-so-hot blob that will live much longer. The typical diameter of a hotspot is 3 squares, and the typical diameter of a lukewarm blob is 5-7 squares. Shorter scale, shorter lifespan.

* **Intuition**: Areas where the temperature exhibits abrupt changes (big change of temperature over a short distance) will diffuse faster: these areas of abrupt change will tend to get smoothed out first. We can be confident in this intuition because we have seen earlier that these abrupt changes are actually due to short wavelength functions, and we know that these will fade first.

To get a feel of what wavelength means in our context of heat, check the visualization below. Red means a positive temperature, Ice blue a negative temperature. Notice how intuitively, a shorter wavelength means a smaller spot, a more detailed pattern, a bigger change in temperature over a small distance. Notice as well how the Dirichlet boundary conditions impose the temperature to be null at the border, whereas the Neumann conditions at the contrary impose it to be very high or very low :

<div id="wvl-sketch" style="text-align: center;">
<section style="display: grid; grid-template-columns: 1fr 1fr 3fr; grid-template-rows: 1fr 1fr; column-gap: 5%">

<div>
<b> Boundary Conditions </b>
</div>
<div id = "wvl-conditions-button"></div>
<div class="p5-button-description">
* **Dirichlet**: the heat escapes from the material
* **Neumann**: the heat can not escape the material
</div>

<div>
<b> $$\lvert \lambda_n \rvert$$ slider </b>
</div>
<div id = "wvl-slider"></div>
<div class="p5-button-description">
* low $$\lvert \lambda_n \rvert$$ : long wavelength, will diffuse slow.
* high $$\lvert \lambda_n \rvert$$ : short wavelength, will diffuse fast.
</div>

</section>
</div>
<script async src="{{"js/wavelength_interactive/wavelength_lib.js" | relative_url}}" type="text/javascript"></script>
<script async src="{{"js/wavelength_interactive/wavelength_sketch.js" | relative_url}}" type="text/javascript"></script>


# Time dependence: it's quicker than you think

<button class="toggle-button" onclick="show_element('time-demo')">Show me the steps</button>

<div class="toggle-content" id="time-demo" style="display: none;">

Going back to:

$$ \frac{df_n}{dt}\omega_n = - c (\frac{n\pi}{L})^2 f_n\omega_n $$

We get to write:

$$ \omega_n ( \frac{df_n}{dt} + f_n c (\frac{n\pi}{L})^2 ) = 0 $$

And since $$\omega_n$$ is not zero everywhere, in which case there would not be any diffusion happening anymore:

$$ \frac{df_n}{dt} = f_n c \lambda_n $$

Rejoice, for we know how to solve this! It turns out that this equation is very well-known and its solution is $$f_n = C_n e^{c \lambda_n t}$$.

So now we know the form of $$f_n$$, and we know the form of $$\omega_n$$. Which means that we know the general form of $$u_n$$, and therefore the evolution of $$u$$, the temperature over space and time:
</div>

$$u(x, t) = \sum_n C_n e^{c \lambda_n t} [A_n\sin(\frac{n\pi x}{L}) + B_n\cos(\frac{n\pi x}{L}) ] $$

The values of the parameters $$A_n$$, $$B_n$$ and $$C$$ are determined by the initial conditions (what happens at $$t=0$$) and the boundary conditions (what happens at $$x=0, x=L$$).

### Boundary Conditions (BCs):
* **Dirichlet**: The Dirichlet BC imply that the temperature has to be 0 at the border, which means that we need $$\omega_n(0, t) = \omega_n(L, t) = 0$$ for all values of $$n$$. Therefore $$B_n=0$$ and we have:

$$ u(x, t) = \sum_n sin(\frac{n \pi x}{L}) e^{-c(\frac{n \pi}{L})^2 t }$$

* **Neumann**: The Neumann BC imply that the temperature flux has to be 0 at the border, which means that we need $$\frac{\partial \omega_n}{\partial x}(0, t) = \frac{\partial \omega_n}{\partial x}(L, t) = 0$$ for all values of $$n$$. Therefore $$A_n=0$$ and we have:

$$ u(x, t) = \sum_n cos(\frac{n \pi x}{L}) e^{-c(\frac{n \pi}{L})^2 t }$$

Dope! We solved the heat equation. Its expression is a sum of spatial periodic patterns (one pattern per $$\lambda_n$$, remember the Space Dependence visualization) that each decrease with time at a rate proportional to $$\lambda_n$$ (remember that $$\lambda_n<0$$). Smaller, more detailed patterns (associated with a higher $$\lvert \lambda_n \rvert$$) will decrease faster, and larger, coarser patterns (associated with a smaller $$\lvert \lambda_n \rvert$$) will fade last.

# What about now?

Well, see, here's the thing: heat is just a particular case. There are MANY other phenomena that can be described by the "Heat Equation", because it embodies a very, very physical process: the spread of a finite quantity (noticed that I said finite, not fixed). Rabbits in Australia, covid in Europe, BTS k-pop song "Dynamite" in all my feel-good playlists (it's THAT good), and even more.

And if you have read <a href="https://eartiges.github.io/complex-systems/complexity/p5.js/2021/03/21/collective-behavior-intro-complex-systems.html" target="_blank">my first article on complex systems</a>, you know that interesting things arise when there are interactions at hand. Specifically, if two quantities (animal species, religions, molecules) were to diffuse and interact with one another, would the situation eventually settle down (= reach an equilibrium)? If yes, what would it look like? That's the question I try to answer in <a href="https://eartiges.github.io/complex-systems/complexity/turing-patterns/p5.js/2021/04/01/Turing-patterns-part-1.html" target="_blank"> my next article on Turing patterns</a>.
