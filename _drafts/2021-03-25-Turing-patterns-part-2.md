---
layout: post
title:  "Turing patterns: beautiful hot mess - part 2/2"
date:   2021-03-21 11:44:13 +0000
categories: complex-systems complexity turing-patterns p5.js  
summary: Where we shoot big guns at a math problem, and learn about the cost of homophobia.
---

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

Take a deep breath, go have a walk, have a drink of water: we did it. We just built our first lightsaber: the trio of conditions for Turing patterns to emerge. Now, it's time that we put it to the test and go all chop-chop with it. We will solve a system of RC equations with it: the <a href="https://en.wikipedia.org/wiki/Brusselator" trget="_blank">Brusselator</a>. Under this 80s sci-fi villain movie name we find a set of two relatively simple equations (using the nice set of parameter that Begoña Peña (a researcher at the university of Zaragoza) give us in <a href="https://www.researchgate.net/publication/11620469_Stability_of_Turing_patterns_in_the_Brusselator_model" target="_blank"> this paper</a>; $$c_v=8, c_u=1, a=4.5$$):


$$ \frac{du}{dt} = a - (b+1)u + u^2v + \Delta u$$

$$ \frac{dv}{dt} = bu - u^2v + 8 \Delta v$$


We will put our methodology to the test: by testing our three conditions on this system of equations around a homogeneous equilibrium, we will bring a perturbation and look for the periodicities $$n$$ that can survive the diffusion process and establish a new non-homogeneous equilibrium (i.e a Turing pattern).

#### Step 1. Find a homogeneous equilibrium

Remember: homogeneous means flat everywhere, so no diffusion. And equilibrium means $$\frac{dv}{dt}=\frac{du}{dt}=0$$. Therefore we are looking for the values $$(u^*, v^*)$$ that satisfy:

$$ a - (b+1)u + u^2v = 0$$

$$ bu - u^2v = 0$$

I won't develop the calculations here; it's your lightsaber after all! We find $$u^* = a$$ and $$v^* = \frac{b}{a}$$.

#### Step 2. Check that this homogeneous equilibrium is stable

The Jacobian evaluated at $$(u^*, v^*)$$ is:

$$ J|_{(u^*, v^*)} = \begin{pmatrix} b-1 & a^2 \\ -b & -a^2 \end{pmatrix} $$

Bingo! There is a chance that the diagonal terms (and the off-diagonal terms) are of opposite signs if $$b>1$$: we are looking at an inhibitor-activator system when it is the case. It is worth our time pursuing the calculations under this assumption. With $$b \in ]1, +\inf[$$, the first and second conditions on the Jacobian are met:

$$ \mathrm{Tr}(J|_{(u^*, v^*)}) = b - 1  - a^2 < 0 $$

$$ \det(J|_{(u^*, v^*)}) = 1 > 0 $$

#### Step 3. Bring a perturbation and check if and how it can break the homogeneous equilibrium.

So $$(u^*, v^*)$$ is a stable, homogeneous equilibrium. Small perturbations are meant to me absorbed by it and it should, in theory, be able to maintain itself indefinitely. That is, unless we behave very inappropriately and bring a perturbation containing a periodicity $$n$$ that breaks this equilibrium (i.e that verifies):

$$ \det(J + \lambda_n D) < 0 $$

With $$ D = \begin{pmatrix} 1 & 0 \\ 0 & 8 \end{pmatrix} $$. Developing the previous inequation leads to:

$$ \det(J + \lambda_n D) = 8\lambda_n^2 + \lambda_n(8b-a^2-8) + a^2 $$

Great! It's a polynomial! And it's only of degree 2! It's good news: those can't resist us, we did master them a long time ago. Remember: we are looking for the value of $$\lambda_n$$ for which the above polynomial is negative. Since its coefficient in $$\lambda_n^2$$ is positive, its extremum is a minimum, and is reached at $$\lambda_{min} = - \frac{(8b-a^2-8)}{16}$$:

$$ \det(J + \lambda_{min} D) = -\frac{(8b - a^2 - 8)^2}{32} + a^2 $$

Which means that for an instability to arise, we need:

$$ -\frac{(8b - a^2 - 8)^2}{32} + a^2 < 0$$

$$ \Leftrightarrow  a^2 < \frac{(8b - a^2 - 8)^2}{32} $$

$$ \Leftrightarrow  \frac{a^2}{8} + \frac{a}{\sqrt{2}} + 1 < b $$

$$ \Leftrightarrow  b > (\frac{a}{2\sqrt{2}} + 1)^2 $$

Let's define the critical value of $$b$$ as $$b_c = (\frac{a}{2\sqrt{2}} + 1)^2$$.

Ah-ha ! So now we are left with a condition for the survival of periodicity $$n$$ that only depends on $$b$$, since $$a$$ is fixed. OK, so now we know that:

* if $$b <= 1$$, the system is not an activator/inhibitor system, it cannot sustain any Turing patterns.
* if $$b <b_c$$, the system is an activator/inhibitor system around $$(u^*,v^*)$$ but if a perturbation is brought, it will not result in a Turing pattern.
* if $$b = b_c$$, then the perturbation associated with $$\lambda_{min} = - \frac{(8b-a^2-8)}{16}$$ will be allowed to propagate by diffusion and survive, thus forming a Turing pattern.
* if $$b > b_c$$, then more and more values of $$\lambda_n$$ can propagate and last indefinitely in the system, generating more and more intricate patterns.


#### Step 5. Rejoice !

Now that we worked hard, we deserve that kick of serotonin humans get when they understand something. For this, we will look at the behaviour of the Brusselator model in action, and see that all our hard work will not have been in vain since we can explain what is happening in there using our newfound knowledge. IHere I simulate the Brusselator with the parameter values that we just used. Each cell is colored as a function of its concentration: pure blue means only chemical $$u$$, pure yellow  means only chemical $$v$$, and an in-between concentrations are represented by in-between colours. If you decide to change the value of $$b$$ you need to reset the simulation (either of the two buttons is fine) to see the effects in action.

<div id="bruss-sketch" style="text-align: center;">
<section style="display: grid; grid-template-columns: 1fr 1fr 3fr; grid-template-rows: 2fr 1fr 1fr 1fr 1fr; column-gap: 5%; align-items:center">

<div style="text-align: right">
<b> Current Border Conditions </b>
</div>
<div id = "bruss-conditions-button" style="vertical-align:center"></div>
<div class="p5-button-description" style="text-align:left">
**Dirichlet**: the world goes beyond the boundaries of the window <br>
**Neumann**: the world stops at the boundaries of the window
**Periodic**: simulates a sphere (left/top border = right/bottom border)
</div>


<div style="text-align: right">
<b> $$b$$ Slider </b>
</div>
<div id = "bruss-slider"></div>
<div class="p5-button-description" style="text-align:left">
Tune the value of $$b$$ to allow Turing patterns to emerge. Ranges from $$0.8b_c$$ to $$2b_c$$.
</div>

<div style="text-align: right">
<b> Play/Pause </b>
</div>
<div id = "bruss-stop-button"></div>
<div class="p5-button-description" style="text-align:left">
Pause or resume the animation
</div>

<div style="text-align: right">
<b> Homogeneous reset </b>
</div>
<div id = "bruss-homoG-reset"></div>
<div class="p5-button-description" style="text-align:left">
Reset the grid to a homogeneous stable equilibrium.
</div>

<div style="text-align: right">
<b> Random reset </b>
</div>
<div id = "bruss-random-reset"></div>
<div class="p5-button-description" style="text-align:left">
Reset the grid to random values of u and v averaged around the homogeneous stable equilibrium.
</div>

</section>
</div>
<script src="{{"js/p5-libraries/p5.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"js/p5-libraries/p5.dom.js" | relative_url}}" type="text/javascript"></script>
<script src="{{"js/p5-libraries/p5.sound.js" | relative_url}}" type="text/javascript"></script>
<script async src="{{"js/Brusselator/bruss_lib.js" | relative_url}}" type="text/javascript"></script>
<script async src="{{"js/Brusselator/bruss_sketch.js" | relative_url}}" type="text/javascript"></script>

You can experiment for yourself, here are a few ideas:

* See that when $$b<b_c$$ (extreme left of the **$$b$$ slider**), the perturbation can not spread and the homogeneous equilibrium absorbs everything. No particular definite shape arises from it: it is amorphous and symmetrical. On the contrary as you increase the value of $$b$$ to about 20% of the slider course, you start to see shapes forming and evolving (it is not very clear and quite slow, but it's there). And as the value of $$b$$ keeps on increasing, the nature of the drawing starts to shift: they are combinations of all the $$\lambda_n $$ that now verify $$ \det(J + \lambda_n D) < 0 $$ thanks to the high value of $$b$$.

* Try to do a homogeneous reset for different values of $$b$$, and change the value of the boundary conditions to **Dirichlet**. Look at the tile forming and at the pattern at the center of the tile: it grows more intricate as $$b$$ increases.

* Try to do a homogeneous reset for different values of $$b$$ and either:
  * change the value of the boundary conditions to **Dirichlet**. Look at the tile forming and at the pattern at the center of the tile: it grows more intricate as $$b$$ increases.
  * or leave it to periodic and click on the picture to bring a perturbation, but always in the same place for different values of $$b$$. See how the final pattern looks consistent, but the width of the yellow and blue areas are changing.


Observe how the final patterns look like yellow spots on a blue background for low values of $$b$$, like stripes of each colours for medium values, and like blue spots on a yellow background for high values of $$b$$. With the appropriate mathematical tools, it is actually possible to predict with exactitude the nature of the Turing patterns that will arise from a certain combinations of parameters, but I will stop my analysis here. If you are interested, I recommend the article of Mrs. Peña, in which she maps out the main steps and refers the reader to more complete texts on the matter.

### Going home: the aftermath
