---
layout: post
title:  "Putting old floor plans back on the map"
date:   2026-10-27 09:00:00 +0000
categories: gis geometry optimisation
summary: Where we learn how to drop a campus's worth of floor plans onto the map without a single coordinate, why an algorithm should know when to ask for help, and why the plans were in inches all along.
description: 159 floor plans, each drawn in its own little world. Can an algorithm put them back on the map from their shapes alone, and know when to ask for help?
image: https://eartiges.github.io/assets/plans-back-on-the-map/card.png
echarts: true
---

Here are 159 building plans from Cal Poly, a university campus in San Luis Obispo, California. Each one was drawn in its own little world: its own units, its own origin, its own idea of north. Press *Aligned* and watch them find their buildings.

# A campus in pieces

<div class="post-section">

Nobody tells the algorithm where any plan goes. It only looks at shapes: the outlines in the plans, and the outlines of the real buildings on [OpenStreetMap](https://www.openstreetmap.org) (OSM). From that alone, 64 of the 74 buildings end up in the right place.

<div id="m1-controls" class="cf-controls"></div>
<div id="m1" class="cf-figure" style="height:620px"></div>
<div class="p5-button-description"><b>Map 1.</b> 64 of 74 Cal Poly buildings land in the right place, from their shapes alone. Press <i>Aligned</i> to move the plans; the dashed pieces are plans it couldn't place. Scroll to zoom, drag to pan, hover for the building and its score. Building plans: <a href="https://afd.calpoly.edu/facilities/campus-maps/building-floor-plans/">Cal Poly Administration &amp; Finance, Facilities</a>. Building outlines: © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, ODbL.
</div>
</div>

# Why plans lose their place

<div class="post-section">

Anyone who manages buildings (a university, a hospital trust, a council, a school estate) holds plans by the thousand, drawn in computer-aided design (CAD) software over decades. A CAD plan is made to build or refurbish a building, not to sit on a map: the architect draws in whatever units suit them, from whatever corner is convenient, with the page pointing wherever the paper was. To use those plans in a geographic information system (GIS), for maintenance, space planning or compliance, each one has to be placed on the map: find the building, scale the plan, turn it, nudge it into place. [TK: how long does that take per plan, by hand?] Multiply by thousands of plans, and remember that some buildings have since been extended, split or demolished.

So the job is twofold: place the plans automatically, and say clearly which placements to trust. [TK: can we say we built this for a client with a large estate? If yes, one sentence here.]

</div>

# Finding one scale, rotation and shift

<div class="post-section">

If a plan is drawn correctly but in the wrong place, four numbers put it right: a scale, a rotation, and a shift east and north. Try it yourself in Fig 1, on building 172: eight plans for a cluster of seven residence halls. The score at the top is how well plans and map agree: the area where they overlap, divided by the area they cover together. 1 is a perfect fit.

<div id="f1-controls" class="cf-controls"></div>
<div id="f1" class="cf-figure" style="height:520px"></div>
<div class="p5-button-description"><b>Fig 1.</b> The search finds the scale, rotation and shift in a few seconds, and lands on a scale of exactly 1/12. Drag the sliders and watch the score; press <i>Search</i> to replay the algorithm's guesses (faint) and the polishing that follows. Building 172: eight plans, seven residence halls.
</div>

Fiddly, isn't it? Now press *Search*. The algorithm starts from an educated guess, made from the plans and the buildings taken as wholes: make them cover the same area, line up their long axes, put their centres on top of each other. That gets a score of 0.30. It then tries 1,000 random variations around that guess, which only gets to 0.46. The real work is the polishing: the best few guesses are refined with a classic optimiser (Nelder-Mead, which needs no gradients, handy when your score is a pile of polygons), and that takes it to 0.74.

The scale it settles on is 0.0834 map feet per plan unit: one twelfth. The plans are drawn in inches, the map is in feet, and nobody told it. Across the campus, the median scale it finds is within 1.4% of 1/12.

</div>

# When the site doesn't move as one

<div class="post-section">

Moving all of a building's plans as one block (call it *whole site*) assumes the plans are right relative to each other. Sometimes they aren't. In a few Cal Poly buildings (9, 27 and 28 in Fig 2), some plan files are already on real-world coordinates and others aren't, so no single move fits them all. For those, there is a fallback, *building by building*: place each plan on its own. Scale it to the area of a real building, line up their long axes, and pair each plan with the building it fits best.

The obvious recipe is to run both and keep whichever scores higher (call it *best score*). That's what my first version did, and Map 2 shows why it's a trap. On building 172, placing each plan on its own scores 0.91, higher than the whole site's 0.74, and it puts six of the seven halls on the wrong building. The halls look alike, and nothing ties the pairs together, so any hall will do. And on building 26 (in Fig 2), it places only one of the three plans and still scores 0.98: under that score, leaving the other two out costs it nothing.

<div id="m2-controls" class="cf-controls"></div>
<div id="m2" class="cf-figure" style="height:560px"></div>
<div class="p5-button-description"><b>Map 2.</b> <i>Building by building</i> scores higher on 172, yet puts six of seven halls on the wrong building; <i>whole site</i> keeps every plan where it belongs. Pick a strategy to slide the plans into place: <i>whole site</i> moves them as one block, <i>building by building</i> one at a time. Hover a plan to see which building it was put on.
</div>

Back on the whole campus, most buildings do travel as one block. Map 3 replays Map 1 one building at a time: 67 of the 74 move as a single piece, and only seven fall back to placing each plan on its own.

<div id="m3-controls" class="cf-controls"></div>
<div id="m3" class="cf-figure" style="height:620px"></div>
<div class="p5-button-description"><b>Map 3.</b> 67 of 74 buildings land with a single move for all their plans. Press <i>Aligned</i> to send the buildings one at a time; a building placed <i>building by building</i> has no shared move, so its plans fly separately, and the dashed pieces are plans it couldn't place. Scroll to zoom, drag to pan, hover for the building and its score.
</div>

How do I know where the plans truly belong? By luck: 125 of Cal Poly's 304 plan outlines turn out to be on real-world coordinates already, just multiplied by 12 (inches again). The algorithm never uses that, but it gives an answer key: 32 buildings where I know exactly where every plan should go.

The answer key settles it (Fig 2). *Best score* gets 25 of the 32 buildings right, fewer than *whole site* alone (27). The rule that works, *whole site first*, only falls back to *building by building* when *whole site* clearly fails (a score below 0.4), with plans it leaves out now counting against it. That gets 30 of 32, as many as an oracle that always knew which attempt to keep. [TK: it's also the approach we took on the client project; keep or cut?]

<div id="f2" class="cf-figure" style="height:460px"></div>
<div class="p5-button-description"><b>Fig 2.</b> <i>Whole site first</i> places 30 of 32 buildings correctly, more than either strategy alone and more than <i>best score</i>. One cell per building with an answer key: blue if the attempt the rule keeps puts the plans in the right place, orange if not. Hover a cell for both attempts' scores.
</div>

The lesson is broader than buildings: two scores are only comparable if they measure the same thing. *Whole site*'s score asks "does the site fit?"; *building by building*'s only asked "does each piece fit somewhere?".

</div>

# Knowing when to ask a human

<div class="post-section">

No method gets every building right, so the score has to say when to trust it. For the 42 buildings without an answer key, I checked each placement by eye. Fig 3 puts all 74 together.

<div id="f3-controls" class="cf-controls"></div>
<div id="f3" class="cf-figure" style="height:420px"></div>
<div class="p5-button-description"><b>Fig 3.</b> Above a score of 0.7, 61 of 62 placements are right, and 9 of the 10 wrong ones land below it, in front of a person. One dot per building, blue if its placement is right, orange if wrong (answer key where the plans are georeferenced, checked by eye otherwise). Drag the line, or use the buttons, to trade automation against review.
</div>

With the line at 0.7, 84% of the buildings are placed with no one touching them, and 61 of those 62 are right. The one that slips through, building 52, scores 0.90: two plans for one building, placed close to their true position but not close enough to count.

The line also sends some correct placements to review, and that's the map's fault more than the algorithm's. Building 172 scores 0.74 while every plan is in the right place, because OSM draws those halls more coarsely than the plans do: even the true position only scores 0.66. Moving the line trades a person's time against the risk of a wrong placement going unseen, and where to put it is a choice for whoever owns the data.

</div>

# What this buys you

<div class="post-section">

On Cal Poly, all 74 buildings take 13 minutes on a laptop, and a person only looks at the dozen below the line, each with a candidate placement already drawn.

What it can't do yet is say *why* a building scores low: a demolished wing, an extension, or a plan that was never right in the first place all look the same from here. And Cal Poly's answer key was a lucky accident; on most estates there isn't one, which is exactly why the score, and a person checking below the line, matter. [TK: the open question you'd end on.]

*Building plans from [Cal Poly Administration & Finance, Facilities](https://afd.calpoly.edu/facilities/campus-maps/building-floor-plans/). Building outlines © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), available under the Open Database License.*

</div>

<script>cfCharts.setBase("{{ 'assets/plans-back-on-the-map/' | relative_url }}");</script>
<script src="https://cdn.jsdelivr.net/npm/polygon-clipping@0.15.7/dist/polygon-clipping.umd.min.js"></script>
<script src="{{ 'js/plans_back_on_the_map/campus_map.js' | relative_url }}"></script>
<script src="{{ 'js/plans_back_on_the_map/one_transform.js' | relative_url }}"></script>
<script src="{{ 'js/plans_back_on_the_map/hard_cases.js' | relative_url }}"></script>
<script src="{{ 'js/plans_back_on_the_map/strategies.js' | relative_url }}"></script>
<script src="{{ 'js/plans_back_on_the_map/threshold.js' | relative_url }}"></script>

<!-- PLAN (delete before publishing; kept at the end so the link preview uses the first paragraph)
Project repo: /Users/emmanuel/Documents/code/Solirius/DfE
Venue: Solirius blog (built and previewed here; prose and figures ported or cross-posted).
Voice: _voice.md, slightly toned down for a company blog (fewer asides, one line on what it means for an organisation).
Reader: prospective clients and future hires. Intuition and the business problem first, method kept light, achievement and impact stated plainly.
Question: can we take building plans that have no coordinates, place them on the real map automatically, and know when to trust the result?
Arguments:
1. Shapes alone are enough to place most plans: one scale, rotation and shift per site, found from the outlines only, places 30 of the 32 answer-key groups correctly, and recovers by itself that the plans are in inches (median scale x12 = 1.014, IQR 1.003-1.034, 56 of 67 within 5%).
2. Trust the whole site first, fall back building by building only when it clearly fails: on the answer key, whole-site alone 27/32, building-by-building alone 22/32, "run both, keep the best score" 25/32, whole-site first 30/32 (same as an oracle). Why: building-by-building swaps look-alike buildings (172: 6 of 7 halls on the wrong building, score 0.91) and its score ignored the plans it left out (26: 1 of 3 plans placed, score 0.98). The answer key caught it; the code now does whole-site first + coverage-weighted fallback score (branch auto-match/whole-site-first), which is also the approach shipped for the client.
   On all 74 groups (answer key + hand labels): whole site 60, building by building 51, best score 58, whole site first 64. Fig 2 shows the answer key only (32, no human judgement).
3. The confidence score is part of the product: on all 74 groups, above a score of 0.7, 62 (84%) are placed automatically and 61 of them are right; of the 10 wrong placements, 9 score below 0.7 and go to a person. The one that slips through is 52 (score 0.90). 0.6 / 0.75 / 0.8: 92% / 76% / 66% automatic.
Ground truth for "correct placement" (independent of the score): 125 of 304 plan outlines are already georeferenced in EPSG:2229 x 12 (inches). Answer key = 32 groups where that georeferenced plan overlaps its OSM buildings (ceiling IoU >= 0.5); correct = IoU >= 0.5 with the georeferenced plan. Other 42 groups: Emmanuel's hand labels (project repo, data/CalPoly/labels/), with the answer key's rule for partial placements: building by building only counts as right if it placed at least 60% of the plans.
Data prep: footprints that merge floors drawn in different coordinate systems (14 MultiPolygons with far-apart copies) keep their largest part.
Method as the code does it (not the STAR note): identity pre-check -> transform_search_match (priors from the two groups' union area ratio, MRR long-axis angle, centroid offset; hybrid score 0.7 group IoU + 0.3 Hungarian mean IoU; Nelder-Mead on the top 5) -> dumb_match (pair-by-pair) only if that scores < 0.4 -> keep the best attempt, dumb_match's score weighted by the share of plan area it matched.
Runtime: 74 groups in 13 min on a laptop, median 4.2 s per group.
Numbers: all recomputed from Cal Poly only. No DfE numbers, no client named; the motivation stays generic ("organisations holding thousands of legacy plans").
Data: Cal Poly building plans (DWG, area-gross layer), Cal Poly Administration & Finance, Facilities, https://afd.calpoly.edu/facilities/campus-maps/building-floor-plans/ ; building outlines from OpenStreetMap, © OpenStreetMap contributors, ODbL.
Code excerpts: none.
Figure ids follow labels: m1, f1, m2, m3, f2, f3.
-->
