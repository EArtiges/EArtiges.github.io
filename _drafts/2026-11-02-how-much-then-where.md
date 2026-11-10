---
layout: post
title:  "How much, then where: splitting a bike-share forecast in two"
date:   2026-11-02 00:00:00 +0000
categories: mobility tensors forecasting
summary: "Where we learn about hierarchical forecasts, why last week's total is a better forecast than the summer average, and which part of a spatio-temporal forecast is worth improving"
description: "A bike-share forecast has to say how many trips, and where and when they happen. Splitting the two questions halves the weekly error in Oslo, but changes almost nothing slot by slot."
image: https://eartiges.github.io/assets/how-much-then-where/card.png
echarts: true
---

<div id="hw-header" class="cf-figure" style="border:none"></div>

[TK: opening — the business need first (a forecast planners can act on: how many trips next week, and where/when), then the obstacle: the habits post's model predicts an average summer week, which is right about where and when, but not about how much. Then the question: does splitting the forecast into a volume and a share do better, and at which level?]

# Two ways to forecast a week
<div class="post-section">

<!-- Method, kept short (the habits post explains the factorisation; link to it). A: one Tucker model of
     average counts. B: a hierarchy — a weekly volume forecast (last week's total) x shares from a Tucker
     model of normalised weeks (each week as a share of its trips), then optional corrections (C: a
     seasonal week-on-week factor from other summers; D: a daily weather corrector). B*: the hierarchy
     with the true weekly volume, to split the error between volume and shape. Held-out design: train on
     the six full odd ISO weeks of summer 2023, test on the six full even weeks. -->

[TK: two short paragraphs + a list of the five variants]

</div>

# Most of the error is in the volume
<div class="post-section">

<!-- Argument 1. Weekly totals: the average week misses by 18.8%; last week's total by 8.6%. Week 28
     (first fellesferie week) is the big miss for every method. -->

<div id="f1-controls" class="cf-controls"></div>
<div id="f1" class="cf-figure" style="height:420px"></div>
<div class="p5-button-description">
**Fig 1.** Last week's total is a better forecast of next week than the summer average: it misses the six test weeks by 8.6% on average, against 18.8%. Weekly trips in summer 2023 (training weeks in grey), with each method's forecast for the test weeks.
</div>

[TK: what Fig 1 shows; week 28; the seasonal factor from other summers (C) does worse than last week alone, 12.4%]

</div>

# Which method wins depends on the level
<div class="post-section">

<!-- Argument 2. Same methods, scored at three levels. Volume gains show at week and day level; at the
     slot level (j = 1 rule, decision 0016) every method misplaces ~17.5% vs ~11.5% for an ideal model,
     93–94% of what is achievable, because chance dominates and all methods share the same spatial shape.
     B* (true volume) still has 22% daily error: the rest is how trips spread over the days. -->

<div id="f2-controls" class="cf-controls"></div>
<div id="f2" class="cf-figure" style="height:420px"></div>
<div class="p5-button-description">
**Fig 2.** Splitting the forecast reduces the error on weekly and daily totals, but not on individual slots, where every method stays at about 17.5% against 11.5% for an ideal model. Error of each method on the six test weeks, at three levels; slots are scored with the one-trip rule of the habits post.
</div>

[TK: the volume/shape attribution, in the spirit of the True result: improve the volume term first]

</div>

# Corrections need the right inputs
<div class="post-section">

<!-- Argument 3. Calendar from other summers hurts (holidays move and differ in depth from year to year;
     week 32 gets a 1.26 factor from one unusual 2022 week); a daily weather corrector (wet day x0.82)
     brings the daily error from 27.3% to 25.2%. Fitted on only 35 days; its temperature coefficient is
     slightly negative, which is implausible: needs other summers' days. -->

<div id="f3-controls" class="cf-controls"></div>
<div id="f3" class="cf-figure" style="height:520px"></div>
<div class="p5-button-description">
**Fig 3.** Wet days are where every forecast misses most, and a weather correction recovers part of it. A: daily trips over the six test weeks, observed and predicted. B: rain between 07:00 and 21:00.
</div>

[TK]

</div>

# [TK: takeaway]
<div class="post-section">

<!-- What to improve next: the volume forecast (real holiday dates, weather over more summers); the
     shape is already close to the ideal model at slot level. Limits: one city, one summer, six test
     weeks, naive volume forecast. -->

</div>

<script>cfCharts.setBase("{{ 'assets/how-much-then-where/' | relative_url }}");</script>
<script src="{{ 'js/how_much_then_where/banner.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script src="{{ 'js/how_much_then_where/weekly.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script src="{{ 'js/how_much_then_where/errors.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script src="{{ 'js/how_much_then_where/daily.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>

<!-- PLAN (delete once written). Decisions marked PROPOSED were made without the usual one-at-a-time
     discussion, at the user's request; confirm or overturn.
Project repo: /Users/emmanuel/Documents/code/CityFlux
Reader (PROPOSED): data scientists and analysts working on spatio-temporal forecasting; the post is meant to
  build credibility in spatio-temporal ML.
Question (PROPOSED): does splitting a bike-share forecast into a volume (how much) and a factorised share
  (where and when) beat modelling counts directly, and at which level?
Arguments (PROPOSED):
1. Volume is the dominant error at the levels planners use: weekly error 18.8% (average week) -> 8.6% (last
   week's volume x shares); daily 33.6% -> 26.3%; 22.0% even with the true volume.
2. At the slot level the split changes nothing: j = 1 misplaced ~17.5% for every method vs ~11.5% ideal
   (93–94% of achievable), because chance dominates and the spatial shape is shared.
3. Corrections need the right inputs: last summers' week-on-week factors hurt (12.4% weekly), weather helps a
   little at daily level (27.3% -> 25.2%).
Design: Oslo, summer 2023, H3 r8, hour of week, Tucker 8x8x4. Train: full odd ISO weeks 23–33; test: full
  even weeks 24–34. Last week's total is treated as known when forecasting a week.
Export: CityFlux scripts/blog_hierarchy.py --out assets/how-much-then-where/ (fits cached in
  runs/blog_eleven_habits/).
Data: Oslo Bysykkel open data (NLOD 2.0); weather ERA5 via Open-Meteo; basemap not used.
Early results, not conclusions: one city, one summer, six test weeks.
-->
