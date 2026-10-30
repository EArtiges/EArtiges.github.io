---
layout: post
title:  "Validating geospatial data at scale: a human-in-the-loop ML approach"
date:   2026-10-27 09:00:00 +0000
categories: gis geometry optimisation machine-learning echarts
summary: Where we learn how to drop a campus's worth of floor plans onto the map without a single coordinate, why an algorithm should know when to ask for help, and why the plans were in inches all along.
description: 159 floor plans, each drawn in its own little world. Can an algorithm put them back on the map from their shapes alone, and know when to ask for help?
image: https://eartiges.github.io/assets/plans-back-on-the-map/card.png
echarts: true
redirect_from: /gis/geometry/optimisation/machine-learning/echarts/2026/10/27/plans-back-on-the-map.html
---

<div id="plans-header" class="cf-figure" style="border:none"></div>

Every data migration has to bring legacy data forward. For anyone who manages buildings, that legacy data includes thousands of floor plans, which are not always intended to be displayed on a map. To integrate them with larger systems and allow geospatial analysis, each of these files first has to be geolocalized, and large vendor tools often lack optimization or validation features that can scale to a whole estate.

What we typically want is a method that scales and is explicit about its failure modes. We don't expect full automation, but if we can use machine learning to cut the cost by 80% and clearly flag problematic cases for human validation, we can keep the whole pipeline in-house instead of off-shored, which has two main benefits: sensitive data (such as school plans or military bases) never leaves the organisation, and checking it ourselves improves our understanding of our own data.

# Cal Poly, San Luis Obispo

<div class="post-section">

To showcase a possible approach to this class of problems, we turn to the university campus of Cal Poly in San Luis Obispo, California. This campus publishes 74 of its building plans (159 individual footprints), all drawn in different Coordinate Reference Systems (CRS), which means different units, origins and orientations. These plans cannot readily be laid out together on a single map- they need to be brought to a consistent CRS first. 


<div id="m1-controls" class="cf-controls"></div>
<div id="m1" class="cf-figure" style="height:620px"></div>
<div class="p5-button-description"><b>Map 1.</b> 64 of 74 Cal Poly buildings land in the right place, from their shapes alone. Press <i>Aligned</i> to move the plans; the dashed pieces are plans we couldn't place. Scroll to zoom, drag to pan, hover for the building and its score. Building plans: <a href="https://afd.calpoly.edu/facilities/campus-maps/building-floor-plans/">Cal Poly Administration &amp; Finance, Facilities</a>. Building outlines: © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, ODbL.
</div>

Using geometry and a couple optimisation tricks, we can actually automate the process of geolocating each plan. See the result of our algorithm in [Map 1](#m1): press *Aligned* and watch each plan find its geolocalized building on OpenStreetMap. The algorithm figures out where a plan goes by looking only at its shape: the outlines of the footprints in the plan and of the real buildings on [OpenStreetMap](https://www.openstreetmap.org) (OSM). From that alone, 64 of the 74 buildings end up in the right place.

</div>

# Geolocating a plan

<div class="post-section">

Those plans are drawn in computer-aided design (CAD) software, and a CAD plan is made to build or refurbish a building, not to sit on a map: the architect draws in whatever units suit them, from whatever corner is convenient, in an orientation that fits the building shape. To use a plan in a geographic information system (GIS), someone has to geolocate it: find the building on a real map, scale the plan footprints, turn them, nudge them into place. You can get a sense of how much time that takes by hand for one plan (8 footprints) in [Fig 1](#f1). Multiply by thousands of plans, and remember that some buildings have since been extended, split or demolished.

Geolocating a footprint means finding a projection (a mathematical operation that scales, rotates and shifts a building until its coordinates are expressed in a certain CRS) from the plan's CRS to a target CRS (for San Luis obispo, we'd probably use [EPSG 10925](https://epsg.io/10925)). Try it yourself in [Fig 1](#f1), on building 172: a cluster of seven residence halls + 1 parking lot. The score at the top is how well your aligned plan and the OSM map agree: the area where they overlap, divided by the area they cover together. 1 is a perfect fit. How high a score can you get?

<div id="f1-controls" class="cf-controls"></div>
<div id="f1" class="cf-figure" style="height:520px"></div>
<div class="p5-button-description"><b>Fig 1.</b> The search finds the scale, rotation and shift in a few seconds, and lands on a scale of exactly 1/12. Drag the sliders and watch the score; press <i>Search</i> to replay the algorithm's guesses (faint) and the polishing that follows. Building 172: seven residence halls and one parking lot.
</div>

Fiddly, isn't it?  At scale it's an even more challenging task: every footprint needs its own transformation. Automated tools can find a transformation from an official CRS to another, so we can cross our fingers and hope that all these plans are expressed in an official CRS somehow, but even then it gets costly fast: there are over 6000 CRS projections worldwide, and 130+ for California alone. And what do we do if a plan's coordinate system is not an official CRS? Existing solutions rely on a GIS expert manually finding that transformation (like you just did) using a tool like FME, which is highly unscalable.

Now press *Search*. Our algorithm starts from an educated guess, made from the plans and the buildings taken as wholes: scale the plan juntil it covers the same area as its OSM counterpart, line up their long axes, put their centres on top of each other. That gets a score of 0.30. It then tries 1,000 random variations around that guess, which only gets to 0.46. The real work is the polishing: the best few guesses are refined with a classic optimiser (Nelder-Mead in this case), and that takes it up to 0.74.

The scale it settles on is 0.0834 map feet per plan unit: exactly one twelfth. The plans are drawn in inches! Across the campus, the median scale it finds is within 1.4% of 1/12.

</div>

# When the site doesn't move as one

<div class="post-section">

Plans can feature one or more building footprints, sometimes adjacent, sometimes relatively far apart. Should we move them all as one or one by one? Moving all footprints as one block (call it *whole site*) assumes the relative positions of buildings in a single plan are correct, but sometimes they aren't. In a few Cal Poly buildings (9, 27 and 28 in Fig 2), some plan files are already on real-world coordinates and others aren't, so no single move fits them all. For those, there is a fallback, *footprint by footprint*: geolocate each footprint on its own. Scale it to the area of a real building, line up their long axes, and pair each footprint with the OSM building it fits best.

The obvious recipe is to run both and keep whichever scores higher (call it *best score*), but [Map 2](#m2) shows why it's a trap. On building 172, placing each footprint on its own scores 0.91, higher than the whole site's 0.74, but because the halls all look alike, it mismatches six of them out of seven!

<div id="m2-controls" class="cf-controls"></div>
<div id="m2" class="cf-figure" style="height:560px"></div>
<div class="p5-button-description"><b>Map 2.</b> <i>Footprint by footprint</i> scores higher on 172, yet puts six of seven halls on the wrong building; <i>whole site</i> keeps every footprint where it belongs. Pick a strategy to slide the plans into place: <i>whole site</i> moves them as one block, <i>footprint by footprint</i> one at a time. Hover a footprint to see which building it was put on.
</div>

If the *whole site* approach gets a decent score, we should always prefer it: relative footprint positions bring more information and prevent mismatches or misorientations (if a building is a rectangle, there are 2 possible transformations. If it's a square, there are 4. But if we move these 2 footprints as one, then there is only one). Back on the whole campus, most buildings now do travel as one block of footprints. Map 3 replays Map 1, this time with footprints groups travelling together: 67 of the 74 move as a single piece, and only seven fall back to *footprint by footprint*.

<div id="m3-controls" class="cf-controls"></div>
<div id="m3" class="cf-figure" style="height:620px"></div>
<div class="p5-button-description"><b>Map 3.</b> 67 of 74 buildings land with a single move for all their footprints. Press <i>Aligned</i> to send the buildings one at a time; a footprint placed <i>footprint by footprint</i> has no shared move, so its footprints fly separately, and the dashed pieces are footprints it couldn't place. Scroll to zoom, drag to pan, hover for the footprint and its score.
</div>

But how do we know where the plans truly belong? In real life, we'll almost always have metadata to help us narrow the search for a match in the first place (e.g in OSM, many of the Cal Poly buildings were tagged with their real-life building number). We are lucky enough that we can build an automated testing set: 75 of the 159 footprints turn out to be in real-world coordinates already, just multiplied by 12 (inches again). It gives us 32 buildings for which we know exactly where every plan should go: [Fig 2](#f2).

We can now test different approaches: *Best score* gets 25 of the 32 buildings right, fewer than *whole site* alone (27). The rule that works, *whole site first*, only falls back to *footprint by footprint* when *whole site* clearly fails (a score below 0.4). That gets 30 of 32 correct matches, and it's the approach we'd always recommend with this method.

<div id="f2" class="cf-figure" style="height:460px"></div>
<div class="p5-button-description"><b>Fig 2.</b> <i>Whole site first</i> places 30 of 32 buildings correctly, more than either strategy alone and more than <i>best score</i>. One cell per building: blue if the rule produces a correct match, orange if not. Hover a cell for both attempts' scores.
</div>

The lesson here is a central idea in machine learning: choosing a metric for our algorithm amounts to picking the problem we want it to solve, so we have to be mindful about that. *Whole site* measures the quality of a site-wide fit, whereas *footprint by footprint* measures the average quality of individual fits.

</div>

# Put a human in the loop

<div class="post-section">

No method gets every building right, so we want to use the score as a proxy for model confidence and a threshold for human validation. The dataset here is small enough that we can assess each placement by eye. Fig 3 shows us the score distribution along with the match correctness.

<div id="f3-controls" class="cf-controls"></div>
<div id="f3" class="cf-figure" style="height:420px"></div>
<div class="p5-button-description"><b>Fig 3.</b> Above a score of 0.7, 61 of 62 placements are right, and 9 of the 10 wrong ones get flagged for human validation. One dot per building, blue if its placement is right, orange if wrong. Drag the line, or use the buttons, to trade automation against review.
</div>

With a confidence threshold at 0.7, 84% of the matches are readily accepted, and 61 of those 62 (98%) are correct. The one that slips through, building 52, scores 0.90: two plans for one building, placed close to their true position but not close enough to count.

That threshold also sends some correct placements to review, which is due to differences in data providers: building 172 scores 0.74 while every footprint is in the right place, because OSM draws the halls more coarsely than the plan does and they disagree on the shape of the parking block. Moving that threshold trades analyst time against a higher risk of mismatch: it is a business choice for our data owner. Depending on the scale of our estate and the sensitivity of our data, it might make sense to invest a little time developping a nice UI for our analysts to save a few precious seconds per match validation.

</div>

# The bottom line: performance, validation and deployment

<div class="post-section">

On Cal Poly, our algorithm processes 74 buildings in 13 minutes on a laptop with an out-of-the-box matching accuracy of 86%, and using a reasonable confidence threshold, we send a dozen matches out for human validation. If the validation UI contains something like the alignment tool above and is hooked to a staging environment, we could get to 98% accuracy in a very short amount of time.

What this algorithm cannot solve but will surface are the proverbial data issues: a demolished wing, an extension, or a plan that was never right in the first place will all be flagged for human validation, to the extent that they damage the data enough the match is assigned a poor score. In a sense, an algorithm like this one makes the most sense when it's shipped as part of a more complete validation platform, although that platform can remain extremely light. Tools like Docker, FastAPI and Streamlit allow building a CRUD app in a matter of minutes, and if it never leaves your environment, deployment constraints can be relatively minimal.

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
Ground truth for "correct placement" (independent of the score): 75 of the 159 plan outlines in the 74 groups (134 of all 304 in the files) are already georeferenced in EPSG:2229 x 12 (inches). Answer key = 32 groups where that georeferenced plan overlaps its OSM buildings (ceiling IoU >= 0.5); correct = IoU >= 0.5 with the georeferenced plan. Other 42 groups: Emmanuel's hand labels (project repo, data/CalPoly/labels/), with the answer key's rule for partial placements: building by building only counts as right if it placed at least 60% of the plans.
Data prep: footprints that merge floors drawn in different coordinate systems (14 MultiPolygons with far-apart copies) keep their largest part.
Method as the code does it (not the STAR note): identity pre-check -> transform_search_match (priors from the two groups' union area ratio, MRR long-axis angle, centroid offset; hybrid score 0.7 group IoU + 0.3 Hungarian mean IoU; Nelder-Mead on the top 5) -> dumb_match (pair-by-pair) only if that scores < 0.4 -> keep the best attempt, dumb_match's score weighted by the share of plan area it matched.
Runtime: 74 groups in 13 min on a laptop, median 4.2 s per group.
Numbers: all recomputed from Cal Poly only. No DfE numbers, no client named; the motivation stays generic ("organisations holding thousands of legacy plans").
Data: Cal Poly building plans (DWG, area-gross layer), Cal Poly Administration & Finance, Facilities, https://afd.calpoly.edu/facilities/campus-maps/building-floor-plans/ ; building outlines from OpenStreetMap, © OpenStreetMap contributors, ODbL.
Code excerpts: none.
Figure ids follow labels: m1, f1, m2, m3, f2, f3.
-->
