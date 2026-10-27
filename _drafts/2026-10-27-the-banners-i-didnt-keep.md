---
layout: post
title:  "The banners I didn't keep"
date:   2026-10-27 18:00:00 +0000
categories: meta animation
summary: Where we learn about signals hopping across a graph, and why the header kept its quiet bubbles.
---

The banner at the top of this blog is a handful of drifting bubbles. Every now and then I try to replace it, and the replacement doesn't make the cut. This is where those go: still running, so you can play with them.

## The one I kept

For comparison, here is the current banner: bubbles drifting right, linked whenever they come close to each other.

<div id="f1" data-banner="bubbles" style="height:120px"></div>
<div class="p5-button-description">
<b>Fig 1</b> - The banner that stayed: quiet enough to sit on top of every post. Move your cursor over it to light up the bubbles around it.
</div>

## The original bubbles

The same banner as it first was: the bubbles under your cursor inflate instead of lighting up.

<div id="f2" data-banner="bubbles-original" style="height:120px"></div>
<div class="p5-button-description">
<b>Fig 2</b> - The first version of the banner: hovering inflates the bubbles near your cursor. It's nice and quiet but still a little bit too distracting.
</div>

## Signal waves

The idea: dots drift with no links between them, and links only appear while a signal travels along them, as if waves of signals were crossing the graph.

<div id="f3" data-banner="signal-waves" style="height:120px"></div>
<div class="p5-button-description">
<b>Fig 3</b> - Each wave crosses the whole banner, one hop at a time, and leaves a trail of coloured dots behind it. Click to start a wave from the nearest dot; move your cursor over it to light up the dots around it. It's cute, but too party-like for a header that sits on top of every post.

</div>


<script src="{{ '/js/banners_i_didnt_keep/signal_waves.js' | relative_url }}"></script>
