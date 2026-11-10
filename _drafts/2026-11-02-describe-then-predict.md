---
layout: post
title:  "Describing with habits, predicting with a regressor: forecasting bike trips slot by slot"
date:   2026-11-02 00:00:00 +0000
categories: mobility forecasting machine-learning
summary: "Where we learn when an interpretable factorisation should hand over to a regressor, why the habits add nothing as a feature, and where most of the remaining forecast error comes from"
description: "A tensor factorisation gives a readable description of a city's bike traffic. For forecasting, a volume forecast plus a feature regressor roughly halves the daily error compared with the average-week model, and the habits add nothing as an input."
image: https://eartiges.github.io/assets/describe-then-predict/card.png
echarts: true
---

<div id="dp-header" class="cf-figure" style="border:none"></div>

[TK: opening — the business need (a forecast of next week's trips that planners and operators can act on, by day and by place); the obstacle (the habits post's model is a good description but a weak forecast: it predicts an average week); the question: is the factorisation better used as a description, a forecast, or an input to a regressor?]

# Four ways to forecast a week
<div class="post-section">

<!-- Short method section; link to the habits post and the "how much, then where" post. All methods are
     trained on the six full odd ISO weeks of summer 2023 and tested on the six full even weeks.
     A: the habits post's model (average week). B: shares (Tucker on normalised weeks) x last week's total.
     R0: an XGBoost regressor (Poisson loss) on every slot, with places (POIs, population, stations,
     landmarks, cycling infrastructure), the pair's distance and route, time of week, weather at that
     hour, holiday weeks and last week's total. H: R0's allocation rescaled to last week's total
     (hybrid). H*: the same with the true weekly total, as a ceiling. Scores: weekly and daily totals,
     and the one-trip rule at slot level (decision 0016), with an ideal model. -->

[TK]

</div>

# The hybrid gives the best weekly and daily totals
<div class="post-section">

<!-- Argument 1. Weekly: B and H 8.6% vs R0 13.6% and A 18.8%. Daily: A 33.6% -> B 26.3% -> H 17.9%;
     12.3% with a perfect volume forecast (H*). The volume forecast is still the largest remaining error.
     Wet days (>= 5 mm, n = 15): B 47%, R0 23%, H 26% mean daily error; dry days (n = 27): 15%, 17%, 13%. -->

<div id="f1-controls" class="cf-controls"></div>
<div id="f1" class="cf-figure" style="height:440px"></div>
<div class="p5-button-description">
**Fig 1.** Splitting the forecast into a volume and a regressor-based allocation nearly halves the error on daily totals, from 33.6% for the average week to 17.9%; at the slot level every method stays at 93–95% of an ideal model. Error on the six test weeks at three levels; slots are scored with the one-trip rule.
</div>

[TK]

<div id="f2-controls" class="cf-controls"></div>
<div id="f2" class="cf-figure" style="height:520px"></div>
<div class="p5-button-description">
**Fig 2.** Wet days are where the forecasts differ most: on the 15 test days with 5 mm of rain or more, the shares-based forecast misses by 47% on average and the hybrid by 26%, which catches some of them (2 July, 26–27 August) and misses others (24 July, 7 August). A: daily trips over the six test weeks, observed and predicted. B: rain between 07:00 and 21:00.
</div>

</div>

# The habits add nothing as a feature
<div class="post-section">

<!-- Argument 2. R1 (regressor + out-of-fold habit prior) makes the prior its most important feature
     (~36% of the gain) but scores no better than R0 (16.9% vs 16.2% slot misplaced; daily 22.0% vs 19.3%):
     the prior repeats what places and distance already say. Without the prior, destination food-and-drink
     POIs and the pair's distance lead. Caution: gain measures what the regressor uses to PLACE trips across
     4.4M mostly empty slots (destination POIs 50% in R0); weather (0.5%) and time (2.3%) shift how MANY
     trips every slot gets, a small gain per split, yet they drive the daily-total improvement. Present Fig 3
     as "what the regressor uses to place trips", not "what matters for the forecast". -->

<div id="f3-controls" class="cf-controls"></div>
<div id="f3" class="cf-figure" style="height:420px"></div>
<div class="p5-button-description">
**Fig 3.** Given the habits, the regressor relies on them first, yet predicts no better, most likely because they repeat what the places and distances already tell it. Share of the regressor's gain by feature family, without (R0) and with (R1) the habit prior.
</div>

[TK]

</div>

# [TK: takeaway]
<div class="post-section">

<!-- Argument 3 / takeaway. Describe with the factorisation (readable, compact, close to the ideal), predict
     with a hierarchy (volume x feature-based allocation); improve the volume forecast next. Limits: the
     regressors see observed weather (a perfect weather forecast); six training weeks, untuned; one city,
     one summer, six test weeks. -->

</div>

<script>cfCharts.setBase("{{ 'assets/describe-then-predict/' | relative_url }}");</script>
<script src="{{ 'js/describe_then_predict/banner.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script src="{{ 'js/describe_then_predict/errors.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script src="{{ 'js/describe_then_predict/daily.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script src="{{ 'js/describe_then_predict/importance.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>

<!-- PLAN (delete once written). Decisions marked PROPOSED were made without the usual one-at-a-time
     discussion, at the user's request; confirm or overturn.
Project repo: /Users/emmanuel/Documents/code/CityFlux
Relation to other posts: follows "The eleven habits of a cycling city" (published) and the draft "How much,
  then where" (_drafts/2026-11-02-how-much-then-where.md); this post could absorb that draft's argument.
Reader (PROPOSED): data scientists working on spatio-temporal forecasting; builds credibility in that space.
Question (PROPOSED): is a tensor factorisation of a city's bike trips better used as a description, a
  forecast, or an input to a slot-level regressor?
Arguments (PROPOSED):
1. A hybrid (weekly volume x a feature regressor's allocation) gives the best totals: weekly 8.6%, daily
   17.9% (vs 33.6% for the habits post's average week); 12.3% with a perfect volume forecast.
2. The habits add nothing as a regressor feature: R1 vs R0, 16.9% vs 16.2% slot misplaced, daily 22.0%
   vs 19.3%, though the prior takes ~36% of the gain.
3. At the slot level, every method sits at 93–95% of an ideal model: chance sets the limit, so the next
   gains are in the volume forecast, not in the spatial model.
Design: Oslo, summer 2023, H3 r8, hour of week. Train: full odd ISO weeks 23–33; test: full even weeks
  24–34. Regressors: XGBoost, Poisson loss, 400 trees, depth 8, untuned; R1's habit prior is out of fold.
Export: CityFlux scripts/blog_slot_regressor_probe.py --out assets/describe-then-predict/ (A's numbers
  read from runs/blog_eleven_habits/hierarchy_probe.json, written by scripts/blog_hierarchy.py).
Data: Oslo Bysykkel (NLOD 2.0); ERA5 weather via Open-Meteo; Overture places (POIs); OpenStreetMap
  cycling network (ODbL); Wikidata landmarks (CC0).
Early results, not conclusions.
-->
