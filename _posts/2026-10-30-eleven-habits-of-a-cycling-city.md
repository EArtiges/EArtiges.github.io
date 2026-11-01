---
layout: post
title:  "The eleven habits of a cycling city"
date:   2026-10-30 09:00:00 +0000
categories: mobility gis tensors
summary: "Where we learn about signal decomposition, why a city has no true number of cycling habits and the morning rush down to Oslo's harbour"
description: "Eleven recurring habits make up a summer of bike trips in Oslo, and what they miss is mostly noise. Here is how to find them."
image: https://eartiges.github.io/assets/eleven-habits-of-a-cycling-city/card.png
echarts: true
---

<div id="eh-header" class="cf-figure" style="border:none"></div>

Urban planning, like any other data-driven field, benefits from a readable representation of the data that supports its decisions. Transportation planners are interested in the handful of meaningful, recurring flows behind the raw log numbers, ideally associated with a place and a time that a human can understand ("the morning rush down to the harbour"), and a transparent measure of the trip volume that is not covered by that readable representation. If a dozen habits can carry nearly all traffic and what they miss is mostly chance, we've won our bet and the data takes a form that can be easily discussed and understood.

But bike-share operators publish where their riders go as trip logs: Oslo Bysykkel's open data publishes trip history, featuring where and when each trip started and ended. These logs contain enough information to produce an hourly origin-destination matrix: how many trips ran from each place to each other, hour by hour. For one summer of Oslo's city bikes, cut into 66 neighbourhood-sized cells and the 168 hours of a week, that's 66 × 66 × 168 = 731,808 numbers. Any insight hidden inside is hard to extract without specific knowledge and know-how.

Can we use machine learning and signal decomposition techniques to extract meaningful representations of that trip dataset; in other words, can we discover what the cycling habits of Oslo are? 


# Half a million trips
<div class="post-section">

Oslo Bysykkel's open trip data for June to August 2023 contains 496,073 trips. For easier spatial treatment, we can group stations into [H3 cells](https://h3geo.org/) (resolution 8), and keep the 66 cells where trips actually start or end. [Map 1](#m1) denotes trip activity across the grid.

<div id="m1-controls" class="cf-controls"></div>
<div id="m1" class="cf-figure" style="height:740px"></div>
<div class="p5-button-description">
**Map 1.** Oslo's bikes leave from a few cells on the east side and along the harbour: the ten busiest cells hold 47% of weekday departures. Drag the slider to change the hour, switch between departures and arrivals, weekdays and weekends; scroll to zoom.
</div>

Drag the slider from 07:00 to 17:00 on a weekday and you can already see the city's pulse: in the morning Grünerløkka, Frogner and Majorstuen empty out while Sentrum, Bjørvika and Aker Brygge fill up, and in the late afternoon it goes the other way. [Fig 1](#f1) shows the same thing in time.

<div id="f1-controls" class="cf-controls"></div>
<div id="f1" class="cf-figure" style="height:380px"></div>
<div class="p5-button-description">
**Fig 1.** On a weekday Oslovians typically ride twice, at 08:00 and 16:00; at weekends they ride once, all afternoon. Departures per hour across the city on an average day. Click an hour to show it on [Map 1](#m1).
</div>

A weekday peaks at 576 departures per hour at 08:00 and 622 at 16:00; a weekend day climbs to a plateau of about 300 from noon to 18:00. Between 01:00 and 05:00 nothing moves since the bikes can only be unlocked from 5 am to 1 am.

</div>

# Splitting the traffic into habits
<div class="post-section">

To extract a readable/understandable representation of the dataset above, we set out to define habits. Intuitively, a habit corresponds to a sentence like "people from *these* cells ride to *those* cells at *these* hours". Our goal is to summarize the city's traffic well with a short list of such sentences: we want to find them by finding which small set of origin groups, destination groups and weekly rhythms rebuilds the table best.

In signal decomposition, a technique called Tucker decomposition does pretty much exactly this:

$$X \approx G \times_1 A \times_2 B \times_3 C$$

- $X$ is the table: trips from each of the 66 origin cells to each of the 66 destination cells, in each of the 168 hours of the week, summed over the summer.
- $A$ holds groups of origin cells, each a weighting over the 66 cells; $B$ holds groups of destination cells.
- $C$ holds rhythms: each a curve over the 168 hours of the week.
- $G$, the core, says how many trips flow from origin group $i$ to destination group $j$ in each rhythm.

Each pair (origin group + destination group) is a candidate habit, with its own places and its own mix of rhythms. We'll see below how we can find the right number of groups- for Oslo, 8 departure and 8 arrivals groups gave a good representation: that's 64 habit candidates. We only keep those carrying more than 1% of the model's trips, and pick the smallest set of habits summing up to 95% of all trips: that leaves eleven habits. We now have a decent representation of the data that fits in 1,984 numbers, against the original table's 731,808.

If you care about modelling details: because we are modelling counts, we fit using a Poisson loss rather than plain squared error, and we use a tensor rather than a flat decomposition like NMF because flattening throws away the fact that the same origin appears in many pairs. In a test on synthetic data where true patterns were planted, Tucker recovered nine in ten of them while flat NMF found at most a third.

</div>

# Eleven habits
<div class="post-section">

<div id="m2-controls" class="cf-controls"></div>
<div id="m2" class="cf-figure"></div>
<div class="p5-button-description">
**Map 2.** Each habit is defined by a spatial pattern and a rythm: habit 4 is the weekday morning ride from Grünerløkka down to the harbour. Pick a habit, and switch between where it departs from and where it arrives; the curves are its trips per hour on an average weekday and weekend day.
</div>

Habit 4 is a convenient introduction to the model's output: it describes the morning commute from Grünerløkka and Tøyen down to Bjørvika, Sentrum and Aker Brygge, the offices along the harbour: those three cells rank 1st, 2nd and 9th of the 66 for business listings in Overture's places data. It carries 10% of the summer trips, is a very strong weekday pattern (91% of habit 4 trips take place Mon-Fri), and peaks at 233 trips per hour at 08:00.  Habit 10 is the west side's version, from Majorstuen and Frogner to Aker Brygge and Skøyen. Habits 7 and 5 are their respective pendulum counterpart at 16:00!

The three morning commutes (4, 8 and 10) carry 21% of all trips between them- but some habits aren't commutes at all. The biggest, habit 1 (18.5%), starts and ends around Grünerløkka and Tøyen: the east side getting around its own neighbourhood, busiest at 16:00 and steady through weekend afternoons. Habit 6 is the same for Majorstuen and Frogner, and habit 9 takes people from Skøyen and Aker Brygge out to Bygdøy, with a quarter of its trips at weekends.

We have to be careful when labelling a habit as "weekday" vs "weekend": 72% of the summer's days are weekdays, so a habit with 76% of its trips on weekdays is about neutral. Only the morning commutes are clearly weekday habits, and no habit is weekend-only: on Saturdays and Sundays, Oslovians ride to and from the same places, just later and less.

</div>

# How many habits?
<div class="post-section">

The data does not tell us how many habits Oslo has: our model needs us to give it a resolution, i.e a number of origin groups, destination groups and rhythms (8 · 8 · 4 for the eleven habits above), and a higher resolution always produces more habits. To choose one, we need to know what each additional habit is large enough to add meaningful information to the description of the data.

We measure our model's performance on data it has not seen: we fit it on the odd weeks of the summer, use it to predict the even weeks slot by slot (origin cell, destination cell, hour of the week), and count the missing/extra trips. Most of these slots are almost empty: over the seven test weeks, a slot holds 0.33 trips on average, and 87% of slots hold none. Below one expected trip, the model cannot say more than "at most one trip", so that is all we ask of it: a prediction under one trip counts as correct whether the slot holds 0 or 1 trip. Under this rule, the model misplaces 24.7% of the test weeks' trips at 8 · 8 · 4. Part of that error cannot be removed by any model, because trips vary at random around their average rates: an ideal model that knew those rates exactly would still misplace 17.3%. Only the gap between the two, 7.4 percentage points, reflects structure that a finer model could still capture. As a reference, using the odd weeks as prediction misplaces 28.5% of all trips.

<div id="f2" class="cf-figure" style="height:560px"></div>
<div class="p5-button-description">
**Fig 2.** The error decreases quickly up to 4 · 4 · 2 and slowly afterwards, without a clear stopping point: there is no ideal number of habits; beyond eleven habits, each additional habit carries about 1% of trips. 
- A: share of trips misplaced on seven test weeks, against an ideal model with perfect information and past weeks as a prediction. 
- B: number of habits and share of trips carried by the smallest habit at each resolution .
</div>

Panel A shows how the error responds to the resolution. Between 2 · 2 · 1 and 8 · 8 · 4, we add 9 habits and the gap to the ideal model shrinks by 4.9 percentage points, from 12.3 to 7.4; it then stays at about 7.4 up to 12 · 12 · 6, and adding 18 habits beyond 8 · 8 · 4 (up to 24 · 24 · 12) only reduces it by a further 1.3 points. The error keeps decreasing, but adding more habits yields diminishing returns, and there is no resolution at which it clearly stops: we did not find a "true" number of habits in the data. From 4 · 4 · 2 onwards, the model also misplaces fewer trips than the raw counts of past weeks.

Panel B shows what those additional habits look like. The smallest habit carries 4.1% of all trips at 8 · 8 · 4. Beyond that resolution, the model mostly adds small habits that improve the fit marginally and that we would find harder to name and describe. This is why we kept 8 · 8 · 4: it is a choice based on readability, and a different use case could justify a finer resolution.

</div>

# The city's pulse
<div class="post-section">

<div id="m3-controls" class="cf-controls"></div>
<div id="m3" class="cf-figure" style="height:620px"></div>
<div class="p5-button-description">
**Map 3.** The habits take turns: commutes peak at 08:00 and 16:00 while neighbourhood habits fill the afternoon. Departures per hour of the week, each panel on its own scale; the last panel is all trips as observed. Press play to run the week five times, or drag the slider.
</div>

Press play and watch the week unfold: habits 4, 8 and 10 peak around 08:00, hand over to the neighbourhood habits through the day, and come back reversed as 7 and 5 at 16:00. At the weekend the commute panels stay low and everything else starts later. The last panel, all trips as observed, is there for comparison.

</div>

# What's left over
<div class="post-section">

The real test of a model is data it has never seen. Let's pick one week at random and refit the model on the rest of the summer. Drawing outside the holidays, we get 3–9 July as our test week.

<div id="f3-controls" class="cf-controls"></div>
<div id="f3" class="cf-figure"></div>
<div class="p5-button-description">
**Fig 3.** In a test week, the habits absolute errors concentrate in the busiest cells: the shortfall is in the busy core, on a wet Thursday and on the last Friday before fellesferie. Relative error scatters across the quieter edges instead. 
- Map: each cell's departures over the week vs our prediction, as a relative error (% of the model) or an absolute error (trips). 
- Plot: trips per hour across the city, observed against the model, with the model error as bars.
</div>

The week came in 8% below the model: 34,843 trips against 37,880. The time plot shows how that error is distributed throughout the week. Thursday 6 July had 18.4 mm of rain and cycling volume was 32% lower than our prediction; Friday 7 July was nearly dry but as the last working day before fellesferie, ran 14% lower; the warm, dry weekend (22–24 °C) was busier than we predicted. Across the summer's 92 days, a wet day (5 mm of rain or more between 07:00 and 21:00) cuts trips by about a fifth, every extra degree adds about 2%, and the three fellesferie weeks run about a quarter below the average week. All this information is unavailable to the habits!

It's important to mention that the time plot does not tell us about the quality of the individual habits. Summed over all cells, a model fitted with a Poisson loss reproduces the average hourly totals of the weeks it was trained on, whatever its resolution, so our aggregated prediction (the dashed line) is close to an average summer week. The habits are really tested on the map, where the model has to place each trip in a specific cell. The map displays where they got it wrong, with two different lenses: 
- In *absolute error*, the shortfall sits in the busy core: cells in Grünerløkka and Sentrum are each 200 to 300 departures short, because that's where there are the most trips to lose. 
- In *relative error*, the same cells are only 11–16% off, and the colour moves to quieter cells at the edges, where a few dozen trips either way make a big percentage. Blindern, the university campus, is a third down, most likely the summer break. 

Under the same rule as in Fig 2, the model misplaces 17.2% of this week's trips, against 11.7% for an ideal model. Both numbers are lower than over seven weeks because a single week is sparser: more of its slots fall under the one-trip rule, where a prediction is easier to get right. The flip side is that there are more slots for which we do not know the actual number of trips- we accepted some uncertainty from our model, and we got served more of it because a single week is too short to smooth randomness in trip choices.

One thing the residual does show: weeks aren't alike. Across the summer, weekly totals ran from 31% below the average to 26% above it, busy in June and quiet in the holidays, with the 08:00 commute at about half its usual size in fellesferie. The habits describe a typical week, not a particular one.

</div>

# So what would you do with eleven habits?
<div class="post-section">

Eleven habits turn a very large number table into a page: where people ride from, where to, when, and how much each habit weighs. Good enough to talk about a city's cycling in human terms (the morning rush to the harbour, the east side getting around), to compare neighbourhoods and to identify which flows a new lane or a station move would impact. Not good enough to forecast a particular week: weather and holidays move the volumes, and the habits don't know about either. But the habits could serve as input to a more precise algorithm, along with calendar, cultural events, weather forecast etc!

Oslo is already investing in its cycle network. Since its cycling strategy was adopted in 2015, the city has built or upgraded 155 km of cycle paths, and an evaluation for the city found commuting by bike up 62% ([Oslo kommune, 2024](https://aktuelt.oslo.kommune.no/oslos-sykkelsatsing-har-bidratt-til-mer-og-tryggere-sykling)). Habits like the morning ride down to the harbour show which flows that network has to serve. Whether they actually ride on it is a question for a future post...

If this were a real product, next steps would probably include:
- **Weekly volumes:** keep the habits' places and rhythms fixed and fit only their volumes, week by week;
- **Weather:** fine-tune our trip counts with rain and temperature;
- **Other cities:** the same pipeline can run on any city with an open trip log, and comparing their habits is where it gets interesting;

If you're a planner, an operator, or anyone working in transportation, I'd love to talk to you. [Get in touch](mailto:emmanuel.artiges@gmail.com)! 

<hr style="border:0; border-top: dotted; margin:30px">

*Data: trips from [Oslo Bysykkel's open data](https://oslobysykkel.no/en/open-data/historical) (NLOD 2.0); basemap © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright) (ODbL), via Protomaps; weather from ERA5 (Open-Meteo); hexagons from Uber's H3.*

</div>

<script>cfCharts.setBase("{{ 'assets/eleven-habits-of-a-cycling-city/' | relative_url }}");</script>
<script src="{{ 'js/eleven_habits_of_a_cycling_city/oslo_map.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script src="{{ 'js/eleven_habits_of_a_cycling_city/banner.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script src="{{ 'js/eleven_habits_of_a_cycling_city/city_map.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script src="{{ 'js/eleven_habits_of_a_cycling_city/daily_profile.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script src="{{ 'js/eleven_habits_of_a_cycling_city/habits.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script src="{{ 'js/eleven_habits_of_a_cycling_city/resolution.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script src="{{ 'js/eleven_habits_of_a_cycling_city/pulse.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script src="{{ 'js/eleven_habits_of_a_cycling_city/residual.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>

<!-- PLAN (delete once written)
Project repo: /Users/emmanuel/Documents/code/CityFlux
Reader: transport planners, bike-share operators and mobility consultants. Comfortable with maps and
  dashboards, not with tensors. The post is a conversation starter with potential clients.
Question: what handful of habits sits behind Oslo's bike traffic?
Business problem (opening): the standard output of a mobility study is an origin–destination matrix,
  thousands of cell pairs × 168 hours that nobody can read. Good enough = compress it into a dozen
  readable flows without losing more than a few % of trips.
Arguments:
1. A few habits carry nearly all the traffic, and what they miss is mostly chance. Honest metric:
   "% of trips misplaced" (½·L1/total over origin × destination × hour slots). The (8,8,4) model
   misplaces 33.8% of the summer's trips; pure Poisson noise alone would cost 26.2% even with the
   true rates (most slots expect a fraction of a trip but hold 0 or 1). The 11 habits carry 95.4%
   of the MODEL's mass: never write "explain 95% of trips". On a week held out of the fit the
   residual should have no rhythm left in time and no hotspot in space. (Falsifiable: if it still
   peaks at 8am, we say so.) OUTCOME (week 27): flat in time except a wet Thursday and the Friday
   before fellesferie; in space, absolute error clusters in the busy core, relative error scatters.
   Day-level fit over 92 days: wet day x0.81, +1C x1.02, fellesferie x0.71-0.76 depending on the
   (unverified) end of Oslo's 2022/23 school year, 16-23 June; R2 0.65-0.66. Text says "about a quarter".
   Real-data check (no noise model): fit on odd ISO weeks, predict the even ones. The odd weeks'
   raw counts (731,808 numbers) misplace 43.0% of the even weeks' trips; the (8,8,4) model fitted
   on them (1,984 numbers) misplaces 42.7%; the model beats the raw table from (6,6,3) upwards.
   Planner line: the habits predict next week as well as the full table of past trips does.
   Held-out week 27 (3–9 July): 34,843 trips vs 37,880 predicted (−8%); 72.5% misplaced vs a 65.7%
   floor. Time residual flat except Thursday afternoon: 6 July had 18.4 mm of rain, the week's
   wettest day (ERA5, data/silver/weather). Map residual has no clear hotspot.
   Found on the way, worth a sentence: weeks are not alike. Weekly totals run −31% to +26% around
   the summer average (June busy, fellesferie quiet, 8am commute at ~half), so a summer model
   predicts a typical week, not a particular one.
2. Each habit reads as a place plus a time a planner can name (weekday AM into downtown, weekend
   midday loop away from the centre; cf. decision 0005).
3. There is no "right" number of habits: error keeps falling with resolution, no elbow (decision
   0006). It's a dial you choose. Kept short, almost a modelling detail. Summer fit: 40.7% (2·2·1)
   → 33.8% (8·8·4) → 31.4% (24·24·12) misplaced, against a floor of 27.6% → 25.7%. Split-half view:
   flat at 42.7% from 6·6·3 to 12·12·6, then 40.4% at 24·24·12 (softest of shoulders, not an elbow).
Scope: Oslo, Jun–Aug 2023, H3 r8 (66 active cells), 496,073 trips, 168-bin hour-of-week time mode
  (weekday/weekend only as a reading: curves split Mon–Fri vs Sat–Sun, as in
  mobility_report/configs/time_grain/hour_of_week.yaml). Model = the repo's non-negative Tucker with
  Poisson-KL (tucker/ntd.py), rank (8,8,4), run 8x8x4-ce8c0491; habits = motifs
  retained by the repo's rule (mass > 1%, ≤ 95% cumulative).
Naming: the components are "habits" everywhere (text, captions, tooltips); "motif" mentioned once as
  the technical term. Ranks are "resolution".
Held-out week: one full ISO week of summer 2023 picked at random (own generator, seed 2023) OUTSIDE
  fellesferie (weeks 28–30) — it is week 27 — and the (8,8,4) model refit without it. Say so in the
  text: the first draw landed on week 28, where a summer-average model can only report "the commute
  stayed home".
Verified: Fig 1's zero 01:00–05:00 is the operator's rule — "The City Bikes are available for unlock
  between 5 am and 1 am" (oslobysykkel.no/en/faq, read 2026-10-30, no year given); the 2023 data agree
  (26 summer trips started 01:00–05:00, vs 7,354 in the 00:00 hour and 2,072 in the 05:00 hour).
E-bikes: the open data has no bike-type field, so they cannot be separated; say so, don't claim a filter.
Not in scope: NMF comparison, trip modelling, weather, e-bikes, routing.
Code excerpts: none.
Data and credits (all public, nothing to clear):
- Trips: Oslo Bysykkel historical open data, NLOD 2.0 (attribution) — https://oslobysykkel.no/en/open-data/historical
- Basemap (water, parks, major roads, labels): © OpenStreetMap contributors, ODbL, via the Protomaps
  extract mobility_report/assets/maps/oslo.pmtiles, converted to themed GeoJSON (no tiles, no new library).
- H3 grid: Uber H3 (Apache 2.0).
Figures (export: CityFlux scripts/blog_eleven_habits.py and scripts/blog_eleven_habits_basemap.py,
  both --out <blog>/assets/eleven-habits-of-a-cycling-city/; fits cached in CityFlux runs/blog_eleven_habits/):
- Map 1  city_map.js     hex choropleth, hour slider, Departures/Arrivals, Weekday/Weekend, basemap, zoom
- Fig 1  daily_profile.js weekday (solid) vs weekend (dashed) departures per hour, average day
- Map 2  habits.js       habit explorer, a wide chart: square map (Departures/Arrivals) beside the
                         habit's weekday/weekend curves; buttons for habits 1–11
- Fig 2  resolution.js   % of trips misplaced vs resolution (2,2,1)→…→(24,24,12), summer fits, with
                         each fit's Poisson noise floor; gap shaded; (8,8,4) marked; habits per
                         resolution in the tooltip. No held-out line (a single week's error is
                         dominated by its volume, which no resolution fixes).
- Map 3  pulse.js        11 mini-maps + "all trips", Play over 168 h (cycles the week 5 times),
                         Departures/Arrivals; mini-maps get water + outline only
- Fig 3  residual.js     held-out week, a wide chart (cfCharts.wide): square residual map
                         (diverging, Departures/Arrivals) + time plot 3x as wide (observed, model,
                         residual bars over 168 h; title on the plot). Figure is twice the text width,
                         centred; stacks map-over-plot below 900 px.
Paired views (Map 2, Fig 3) are WIDE CHARTS (cfCharts.wide, split 25/75): a square map frame beside
  a time-plot frame, each its own chart, labelled by the dominant element; the figure is twice the text
  width, centred; it stacks below 900 px. Map 1 and Map 3 are full-width squares (ehMap.sized). The
  basemap is exported on a square Mercator extent, so every map fills its panel.
Resolution 9 tried and rejected (2026-10-31): 189 cells (~1 station each), same 8x8x4 model ->
  8 habits (95.3%), more nameable stations, but (a) split-half: model 80.1% vs raw counts 75.7%
  misplaced, i.e. WORSE than the raw table (r8: 42.7% vs 43.0%, better); (b) 0.08 trips/slot, so the
  misplaced share is mostly noise (summer 71.0% vs floor 65.7%; held-out week 99.7% vs 94.7%);
  (c) speckled maps with ~10 px hexes. Fig 3's time plot is identical at r8 and r9 to <0.4 trips/hour:
  a Poisson fit reproduces the city-wide hourly totals whatever the cells, so only the map tests the
  habits. Code kept: scripts/blog_eleven_habits.py --res 9; probe: scripts/blog_eleven_habits_r9_probe.py.
Banner (#eh-header, js/eleven_habits_of_a_cycling_city/banner.js): habits 4, 1, 10, 9 / 2, 3, 5, 6 as
  footprints (departures + arrivals), 2 rows of 4, static, unlabelled; 7, 8, 11 left out (repeat 4 and the centre).
Evaluation switched to decision 0016 (2026-11-01): held-out odd->even weeks, resolution rule j = 1. Numbers in the
  post: 8x8x4 24.7% misplaced vs ideal 17.3% vs past weeks 28.5%; held-out week 27: 17.2% vs 11.7%; holiday-week
  re-weighting (in-sample, removed from the post): gap 8.7 -> 6.0 pts. Older exact-slot numbers further up this comment are superseded.
-->
