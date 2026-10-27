---
layout: post
title:  "Putting old floor plans back on the map"
date:   2026-10-27 09:00:00 +0000
categories: gis geometry optimisation
summary: Where we learn how to drop a campus's worth of floor plans onto the map without a single coordinate, why an algorithm should know when to ask for help, and why the plans were in inches all along.
image: https://eartiges.github.io/assets/plans-back-on-the-map/card.png
echarts: true
---

<!-- PLAN (delete once written)
Project repo: /Users/emmanuel/Documents/code/Solirius/DfE
Venue: Solirius blog (built and previewed here; prose and figures ported or cross-posted).
Voice: _voice.md, slightly toned down for a company blog (fewer asides, one line on what it means for an organisation).
Reader: prospective clients and future hires. Intuition and the business problem first, method kept light, achievement and impact stated plainly.
Question: can we take building plans that have no coordinates, place them on the real map automatically, and know when to trust the result?
Arguments:
1. Shapes alone are enough to place most plans: one scale, rotation and shift per site, found from the outlines only, puts X of the ~70 Cal Poly building groups in the right place, and recovers by itself that the plans are in inches (scale 1/12 against the map's feet).
2. No single strategy wins everywhere, so run several and keep the best: whole-site alignment works when the plan layout is consistent, building-by-building matching rescues split, extra or moved buildings; keeping the best attempt beats either alone by Y points on Cal Poly.
3. The confidence score is part of the product: a high score reliably means a correct placement, and only Z% of buildings fall in the "ask a human" band.
Ground truth for "correct placement" (independent of the score): plans already georeferenced in inches (true transform known; to verify) + Emmanuel's hand labels from a contact sheet of the rest.
Method as the code does it (not the STAR note): identity pre-check -> transform_search_match (priors from the two groups' union area ratio, MRR long-axis angle, centroid offset; hybrid score 0.7 group IoU + 0.3 Hungarian mean IoU; Nelder-Mead on the top 5) -> dumb_match (pair-by-pair) -> auto_match keeps the best group IoU.
Numbers: all recomputed from Cal Poly only. No DfE numbers, no client named; the motivation stays generic ("organisations holding thousands of legacy plans").
Data: Cal Poly building plans (DWG, area-gross layer), Cal Poly Administration & Finance, Facilities, https://afd.calpoly.edu/facilities/campus-maps/building-floor-plans/ ; building outlines from OpenStreetMap, © OpenStreetMap contributors, ODbL. Credit both under Map 1, in tooltip footers and in the closing note.
Code excerpts: none.
Figure ids follow labels: m1, f1, m2, f2, f3.
-->

# A campus in pieces
<!-- Hook. Map 1: every plan in its own coordinates, then flown onto the OSM campus. Two sentences. Becomes the social card. -->

<div id="m1-controls" class="cf-controls"></div>
<div id="m1" class="cf-figure" style="height:620px"></div>
<div class="p5-button-description"><b>Map 1.</b> [TK take-away: X of ~70 Cal Poly buildings land in the right place with no coordinates to start from.] Press <i>Aligned</i> to move the plans; scroll to zoom, drag to pan, hover for the building, method and score. Building plans: <a href="https://afd.calpoly.edu/facilities/campus-maps/building-floor-plans/">Cal Poly Administration &amp; Finance, Facilities</a>. Building outlines: © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>, ODbL.</div>

# Why plans lose their place
<!-- Business problem, one paragraph, no figure. Plans drawn in their own units, origin and orientation; thousands of them; placing each by hand costs time per building. Goal: make legacy plans a usable GIS asset. Generic, no client. -->

# Finding one scale, rotation and shift
<!-- Argument 1. Intuition: a plan is a stencil of unknown size and angle; slide it until it covers the real building. Then the search does it: guess from the two groups as wholes, try many nearby guesses, polish the best. Lands on the 1/12 scale (inches vs feet). -->

<div id="f1-controls" class="cf-controls"></div>
<div id="f1" class="cf-figure" style="height:520px"></div>
<div class="p5-button-description"><b>Fig 1.</b> [TK take-away: the search finds in seconds the scale, rotation and shift that take minutes by hand, including the 1/12 inches-to-feet scale.] Drag the sliders and watch the overlap score; press <i>Search</i> to replay the algorithm's guesses (faint) and the polishing path to its best answer. Building 172.</div>

# When the site doesn't move as one
<!-- Argument 2. Hard cases: 170 (buildings on top of each other), 19 (one building split in two), 24 (extra buildings in the plans, OSM building split), 43 (plans and map really disagree). Whole-site vs building-by-building vs best-of. Then Fig 2: across the campus, keeping the best wins. -->

<div id="m2-controls" class="cf-controls"></div>
<div id="m2" class="cf-figure" style="height:560px"></div>
<div class="p5-button-description"><b>Map 2.</b> [TK take-away: where the whole-site assumption breaks, matching building by building recovers the placement, and the reverse.] Switch strategies with the buttons; hover a polygon for its score and its match.</div>

<div id="f2-controls" class="cf-controls"></div>
<div id="f2" class="cf-figure" style="height:460px"></div>
<div class="p5-button-description"><b>Fig 2.</b> [TK take-away: keeping the best attempt beats either strategy alone by Y points.] One dot per building group; above the diagonal, building-by-building did better.</div>

# Knowing when to ask a human
<!-- Argument 3. Score vs correct/wrong (ground truth: georeferenced + hand labels). Drag the threshold: share placed automatically vs their accuracy. Z% go to review. -->

<div id="f3-controls" class="cf-controls"></div>
<div id="f3" class="cf-figure" style="height:420px"></div>
<div class="p5-button-description"><b>Fig 3.</b> [TK take-away: above a score of [TK], placements are right [TK]% of the time, leaving [TK]% of buildings for a person to check.] Drag the threshold to trade automation against accuracy.</div>

# What this buys you
<!-- Campus-wide result in one sentence; what doesn't work yet (e.g. 43-type mismatches, near-square buildings whose rotation is ambiguous); the honest open question. No recap. Closing credits note. -->

<script>cfCharts.setBase("{{ 'assets/plans-back-on-the-map/' | relative_url }}");</script>
<script src="https://cdn.jsdelivr.net/npm/polygon-clipping@0.15.7/dist/polygon-clipping.umd.min.js"></script>
<script src="{{ 'js/plans_back_on_the_map/campus_map.js' | relative_url }}"></script>
<script src="{{ 'js/plans_back_on_the_map/one_transform.js' | relative_url }}"></script>
<script src="{{ 'js/plans_back_on_the_map/hard_cases.js' | relative_url }}"></script>
<script src="{{ 'js/plans_back_on_the_map/strategies.js' | relative_url }}"></script>
<script src="{{ 'js/plans_back_on_the_map/threshold.js' | relative_url }}"></script>
