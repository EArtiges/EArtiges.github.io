---
layout: post
title:  "The eleven habits of a cycling city"
date:   2026-10-30 09:00:00 +0000
categories: mobility gis tensors
summary: "Where we learn about origin–destination matrices, signal decomposition, why a city has no true number of patterns and the morning rush down to Oslo's harbour"
description: "Eleven recurring habits make up a summer of bike trips in Oslo, and what they miss is mostly noise. Here is how to find them."
image: https://eartiges.github.io/assets/eleven-habits-of-a-cycling-city/card.png
echarts: true
---

Bike-share operators publish where their riders go as trip logs: Oslo Bysykkel's open data, like that of every one of the 22 operators in this project's archive, has one row per ride, with where and when it started and ended. Count those rides by place and hour and you get an origin–destination matrix: how many trips ran from each place to each other place, hour by hour. For one summer of Oslo's city bikes, cut into 66 neighbourhood-sized cells and the 168 hours of a week, that's 66 × 66 × 168 = 731,808 numbers. Every one of them is true, and nobody can read them.

What a planner actually wants is the handful of recurring flows behind those numbers, each one a place and a time they can name ("the morning rush down to the harbour"), and an honest measure of what that summary leaves out. If a dozen habits can carry nearly all the traffic and what they miss is mostly chance, the matrix becomes something you can talk about in a meeting.

# Half a million trips
<div class="post-section">

The data is Oslo Bysykkel's open trip log for June to August 2023: 496,073 trips. I grouped stations into H3 cells, hexagons of about 0.7 km² each (resolution 8), and kept the 66 cells where trips actually start or end. The open data has no bike-type field, so e-bikes can't be separated out; everything below is every trip.

<div id="m1-controls" class="cf-controls"></div>
<div id="m1" class="cf-figure" style="height:740px"></div>
<div class="p5-button-description">
**Map 1.** Oslo's bikes leave from a few cells on the east side and along the harbour: the ten busiest cells hold 47% of weekday departures. Drag the slider to change the hour, switch between departures and arrivals, weekdays and weekends; scroll to zoom.
</div>

Drag the slider from 07:00 to 17:00 on a weekday and you can already see the city's pulse: in the morning Grünerløkka, Frogner and Majorstuen empty out while Sentrum, Bjørvika and Aker Brygge fill up, and in the late afternoon it goes the other way. [Fig 1](#f1) shows the same thing in time.

<div id="f1-controls" class="cf-controls"></div>
<div id="f1" class="cf-figure" style="height:380px"></div>
<div class="p5-button-description">
**Fig 1.** On a weekday Oslo rides twice, at 08:00 and 16:00; at weekends it rides once, all afternoon. Departures per hour across the city on an average day. Click an hour to show it on [Map 1](#m1).
</div>

A weekday peaks at 576 departures per hour at 08:00 and 622 at 16:00; a weekend day climbs to a plateau of about 300 from noon to 18:00. Between 01:00 and 05:00 nothing moves, and not because Oslo sleeps: the bikes can only be unlocked from 5 am to 1 am.

</div>

# Splitting the traffic into habits
<div class="post-section">

Here's the intuition. A habit is a sentence like "people from *these* cells ride to *those* cells at *these* hours". If the city's traffic is a sum of a few such sentences, we should be able to find them by asking which small set of origin groups, destination groups and weekly rhythms rebuilds the table best.

That's exactly what a Tucker decomposition does:

$$X \approx G \times_1 A \times_2 B \times_3 C$$

- $X$ is the table: trips from each of the 66 origin cells to each of the 66 destination cells, in each of the 168 hours of the week, summed over the summer.
- $A$ holds 8 groups of origin cells, each a weighting over the 66 cells; $B$ holds 8 groups of destination cells.
- $C$ holds 4 rhythms, each a curve over the 168 hours of the week.
- $G$, the core, says how many trips flow from origin group $i$ to destination group $j$ in each rhythm.

Each pair (origin group, destination group) is a candidate habit, with its own places and its own mix of rhythms: 64 candidates. The ones I keep (the project calls them motifs) are those carrying more than 1% of the model's trips, up to 95% of them: that leaves eleven. The whole model is 1,984 numbers, against the table's 731,808.

Two choices worth a sentence each. The fit uses a Poisson loss rather than plain squared error, because these are counts: missing by one trip in a cell that expects two matters more than in one that expects two hundred. And why a tensor rather than one long list of (origin, destination) pairs fed to a flat decomposition like NMF? Flattening throws away the fact that the same origin appears in many pairs, and in an earlier test of mine on synthetic cities, where the true patterns were planted, Tucker recovered nine in ten of them while flat NMF found at most a third.

</div>

# Eleven habits
<div class="post-section">

<div id="m2-controls" class="cf-controls"></div>
<div id="m2" class="cf-figure"></div>
<div class="p5-button-description">
**Map 2.** Each habit is a place and a time: habit 4 is the weekday morning ride from Grünerløkka down to the harbour. Pick a habit, and switch between where it departs from and where it arrives; the curves are its trips per hour on an average weekday and weekend day.
</div>

Habit 4 is the one I'd show first. It carries 10% of the summer's trips, 91% of them on weekdays, and peaks at 233 trips per hour at 08:00: from Grünerløkka and Tøyen down to Bjørvika, Sentrum and Aker Brygge, the offices along the harbour: those three cells rank 1st, 2nd and 9th of the 66 for business listings in Overture's places data. Habit 7 is the same ride home at 16:00. Habit 10 is the west side's version, from Majorstuen and Frogner to Aker Brygge and Skøyen, and habit 5 brings those riders back. The three morning habits (4, 8 and 10) carry 21% of all trips between them.

Others aren't commutes at all. The biggest, habit 1 (18.5%), starts and ends around Grünerløkka and Tøyen: the east side getting around its own neighbourhood, busiest at 16:00 and steady through weekend afternoons. Habit 6 is the same for Majorstuen and Frogner, and habit 9 takes people from Skøyen and Aker Brygge out to Bygdøy, with a quarter of its trips at weekends.

A word of caution on "weekday": 72% of the summer's days are weekdays, so a habit with 76% of its trips on weekdays is about neutral. Only the morning commutes are clearly weekday habits, and no habit belongs to the weekend: on Saturdays and Sundays, Oslo rides the same places, just later and less.

</div>

# How many habits?
<div class="post-section">

Why eleven? Because I asked for 8 origin groups, 8 destination groups and 4 rhythms. Ask for more and you get more habits, and the fit keeps improving. The question is whether it ever stops improving.

To measure the fit, lay the model's trips over the real ones and count the share of real trips sitting in a slot (origin, destination, hour) where the model didn't put them. At our resolution, the model misplaces 33.8% of the summer's trips. That sounds bad until you ask what a perfect model would score: most slots expect a fraction of a trip but can only hold 0 or 1, so even the true rates would misplace 26.2% of trips by chance alone. That's the noise floor, and only the gap above it is structure the model could still learn.

<div id="f2-controls" class="cf-controls"></div>
<div id="f2" class="cf-figure" style="height:380px"></div>
<div class="p5-button-description">
**Fig 2.** There is no elbow: more habits always help a little, so how many to keep is a choice, not a discovery. Share of trips misplaced at each resolution, against the noise floor. *Predicting the other half* fits on odd weeks and scores on even weeks, against the odd weeks' raw counts.
</div>

Tripling the resolution to 24 · 24 · 12 gives 29 habits and only gets to 31.4%. The gap closes slowly and never flattens, so there is no "true" number of habits to find: resolution is a dial, set by how much detail you want to talk about.

The noise floor is a model's view of chance, so here is the same question on real data only. Fit on the odd weeks of the summer and predict the even ones: the odd weeks' raw counts, all 731,808 of them, misplace 43.0% of the even weeks' trips. The eleven habits misplace 42.7%. From 1,984 numbers, the habits predict the other half of the summer as well as the full table does.

</div>

# The city's pulse
<div class="post-section">

<div id="m3-controls" class="cf-controls"></div>
<div id="m3" class="cf-figure" style="height:620px"></div>
<div class="p5-button-description">
**Map 3.** The habits take turns: commutes peak at 08:00 and 16:00 while neighbourhood habits fill the afternoon. Departures per hour of the week, each panel on its own scale; the last panel is all trips as observed. Press play to run the week five times, or drag the slider.
</div>

Press play and watch Monday: habits 4, 8 and 10 peak around 08:00, hand over to the neighbourhood habits through the day, and come back reversed as 7 and 5 at 16:00. At the weekend the commute panels stay low and everything else starts later. The last panel, all trips as observed, is there for comparison.

</div>

# What's left over
<div class="post-section">

The real test of a summary is a week it has never seen. I picked one at random and refitted the model on the rest of the summer. The first draw landed on 10–16 July, the first week of fellesferie, Norway's common summer holiday, when the commute simply stays home: a summer-average model can't know that, so I drew again outside the three holiday weeks, which gave 3–9 July.

<div id="f3-controls" class="cf-controls"></div>
<div id="f3" class="cf-figure"></div>
<div class="p5-button-description">
**Fig 3.** In a week they never saw, the habits miss most where most people ride: the shortfall sits in the busy core, on a wet Thursday and on the last Friday before fellesferie. Relative error scatters across the quieter edges instead. Map: each cell's departures over the week against the model, as a relative error (% of the model) or an absolute error (trips); blue fewer, orange more. Plot: trips per hour across the city, observed against the model, with the difference as bars.
</div>

The week came in 8% below the model: 34,843 trips against 37,880. The time plot says when. Thursday 6 July had 18.4 mm of rain and ran 32% below the model; Friday 7 July, nearly dry but the last working day before fellesferie, ran 14% below; the warm, dry weekend (22–24 °C) ran above it. That's not a one-off: across the summer's 92 days, a wet day (5 mm of rain or more between 07:00 and 21:00) cuts trips by about a fifth, every extra degree adds about 2%, and the three fellesferie weeks run about a quarter below the rest. The habits know about none of this.

The map says where, and its two views answer different questions. In absolute error, the shortfall sits in the busy core: cells in Grünerløkka and Sentrum are each 200 to 300 departures short, because that's where there are the most trips to lose. In relative error, the same cells are only 11–16% off, and the colour moves to quieter cells at the edges, where a few dozen trips either way make a big percentage. Blindern, the university campus, is a third down, most likely the summer break. Over the whole week the model misplaces 72.5% of trips against a 65.7% noise floor (one week is much sparser than a summer, so both numbers are higher).

One thing the residual does show: weeks aren't alike. Across the summer, weekly totals ran from 31% below the average to 26% above it, busy in June and quiet in the holidays, with the 08:00 commute at about half its usual size in fellesferie. The habits describe a typical week, not a particular one.

</div>

# So what would you do with eleven habits?
<div class="post-section">

Eleven habits turn 731,808 numbers into a page: where people ride from, where to, when, and how much each habit weighs. Good enough to talk about a city's cycling in terms a planner already uses (the morning rush to the harbour, the east side getting around), to compare neighbourhoods and to see which flows a new lane or a station move would touch. Not good enough to forecast a particular week: weather and holidays move the volumes, and the habits don't know about either.

Oslo is already investing in its cycle network. Since its cycling strategy was adopted in 2015, the city has built or upgraded 155 km of cycle paths, and an evaluation for the city found commuting by bike up 62% ([Oslo kommune, 2024](https://aktuelt.oslo.kommune.no/oslos-sykkelsatsing-har-bidratt-til-mer-og-tryggere-sykling)). Habits like the morning ride down to the harbour show which flows that network has to serve. Whether they actually ride on it is a question for another post.

If this were a real product, next steps would probably include:
- **Weekly volumes:** keep the habits' places and rhythms fixed and fit only their eleven volumes week by week. A quick test on the first holiday week brought it from 17 points above its noise floor to 4, and the volumes are a story in themselves: in fellesferie some habits halve, others barely move.
- **Weather:** set those weekly or daily volumes against rain and temperature, which the project already has hour by hour.
- **Other cities:** the same pipeline runs on any city with an open trip log, and comparing their habits is where it gets interesting.

[TK: closing line for prospective clients: what you'd offer, how to get in touch]

<hr style="border:0; border-top: dotted; margin:30px">

*Data: trips from [Oslo Bysykkel's open data](https://oslobysykkel.no/en/open-data/historical) (NLOD 2.0); basemap © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright) (ODbL), via Protomaps; weather from ERA5 (Open-Meteo); hexagons from Uber's H3.*

</div>

<script>cfCharts.setBase("{{ 'assets/eleven-habits-of-a-cycling-city/' | relative_url }}");</script>
<script src="{{ 'js/eleven_habits_of_a_cycling_city/oslo_map.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
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
-->
