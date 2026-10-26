---
layout: post
title:  "Recalibrating MODIS tree cover for urban Australia"
date:   2026-10-26 18:00:00 +0000
categories: remote-sensing gis machine-learning echarts
echarts: true
summary: Where we learn about MOD44B's urban bias, matching satellite years to aerial surveys, and the north–south error a correction can't remove.
---

<!-- PLAN (delete once written)
Project repo: /Users/emmanuel/Documents/code/perso/blog_posts/green_area
  Full write-up with every number: REPORT.md. Figure data: scripts/16_blog_data.py --out <blog>/assets/recalibrating-modis
Reader: GIS / remote-sensing practitioners.
Question: is corrected MODIS (MOD44B) fit for suburb-level canopy reporting, and how far can a correction go?
Style: short and figure-led; let the 9 interactive figures carry the argument, a few short paragraphs per section.
Arguments:
1. MODIS's urban error is a bias, not noise (F1, F2).
2. A six-input spline model (GAM) corrects most of that bias and part of the scatter, and should be chosen for how it
   extrapolates (F3-F7).
3. What's left has a geography MODIS's inputs don't capture (F8).
Data: all public. Credit DPLH + CSIRO Urban Monitor (check the Urban Forest licence on data.wa.gov.au, likely CC BY 4.0,
  since derived values ship in assets/); cite MOD44B DOI 10.5067/MODIS/MOD44B.061; credit OSM contributors + Overture for
  the outlines (ODbL). Don't detail the Power BI query workaround. Do NOT mention any earlier/client version of this work.
-->

NASA publishes, every year and for the whole planet, an estimate of how much of each 250 m patch of land is covered by trees. Western Australia publishes something much more precise for Perth and Peel: tree canopy measured suburb by suburb from aerial photos. Put the two side by side and they disagree.

<div id="f1-controls" class="cf-controls"></div>
<div id="f1" class="cf-figure" style="height:640px"></div>
<div class="p5-button-description">
Tree canopy: WA's aerial survey by suburb (vegetation above 3 m), or NASA's MODIS tree cover as its native 232 m pixels. Scroll to zoom, drag to pan, hover for values.
</div>

Same city, same summer, two answers. NASA says Perth's suburbs are barer than they are. By how much, why, and can a free global dataset be corrected into something you could report suburb canopy with? That's what this post is about.

# Two datasets, one suburb at a time

The two datasets couldn't be more different in how they're made:

| | WA tree canopy | NASA MODIS MOD44B |
|---|---|---|
| Source | Aerial photos, flown in mid-to-late summer | Terra satellite, a year of 16-day composites |
| Resolution | About 20 cm | 232 m pixels |
| What "tree" means | Vegetation taller than 3 m (heights from stereo photos, no LiDAR) | Share of light reaching the ground through tree canopy, predicted by NASA's own regression trees |
| What I use | % canopy per suburb, all land uses | Per-suburb mean of tree, other-vegetation and bare-ground cover (they sum to 100), plus the spread of NASA's 30 sub-models |
| Years | 2014, 2016, 2018, 2020, 2024 | Every year since 2000 |

WA's canopy comes from the [Let's Grow Urban Greening dashboard](https://www.wa.gov.au/government/document-collections/urban-greening-data-perth-and-peel), produced by the Department of Planning, Lands and Heritage with CSIRO's Urban Monitor. WA says its data is comparable year to year from 2014, so I start there. Suburb outlines come from [Overture Maps](https://overturemaps.org/), and I only keep suburb-years where WA measured at least 80% of the suburb, so both datasets describe the same ground.

The MODIS side never leaves Google's servers: Earth Engine reduces the pixels to suburb statistics and hands back a table.

{% highlight python %}
suburbs = ee.FeatureCollection(gdf.__geo_interface__)
img = (ee.ImageCollection("MODIS/061/MOD44B")
       .filter(ee.Filter.calendarRange(2023, 2023, "year"))
       .first())
reducer = (ee.Reducer.mean()
           .combine(ee.Reducer.percentile([10, 50, 90]), sharedInputs=True))
stats = img.reduceRegions(suburbs, reducer, scale=231.66)
df = ee.data.computeFeatures({"expression": stats, "fileFormat": "PANDAS_DATAFRAME"})
{% endhighlight %}

One subtlety: the calendars don't line up. A MOD44B "year N" runs from 6 March of N to 5 March of N+1, while WA flies its survey in January and February. So the 2024 survey sits at the very end of MODIS 2023, and that's the year I pair it with. Pairing with MODIS 2024 instead makes no measurable difference, but the previous year has one practical advantage: it's complete by the time the survey is flown, so a current-year estimate doesn't have to wait a year.

# It's a bias, not noise

Here is every suburb and survey year, raw MODIS against WA.

<div id="f2-controls" class="cf-controls"></div>
<div id="f2" class="cf-figure" style="height:520px"></div>
<div class="p5-button-description">
One point per suburb and survey year (suburbs with ≥80% measured). Dashed: least-squares fit; grey: 1:1. Most points sit above the 1:1 line: MODIS reads low.
</div>

Most points sit above the 1:1 line: MODIS reads about 3 points of canopy too low. And the fitted line is nearly parallel to the diagonal (slope 0.91) but shifted up by about 4.6 points. That's an offset, not a scale problem, and offsets are the easy kind of error to fix.

It's also not surprising. The two products don't measure the same thing. WA counts anything taller than 3 m seen from 20 cm away. MODIS predicts how much light reaches the ground through a 232 m pixel that, in a suburb, is mostly roofs, roads and lawns. Scattered street and backyard trees are exactly what that kind of pixel undersells.

# A six-curve correction, chosen for how it extrapolates

I trained a handful of models to map MODIS onto WA's canopy, with six inputs per suburb: the five MOD44B layer means (tree, other vegetation, bare ground, and the two uncertainty layers) plus the suburb's area. I tried richer feature sets too (percentiles, PCA), and for the linear and smooth models they didn't beat these six, which have the advantage that anyone can read them.

Suburbs were split 60/20/20 into training, testing and validation, so that all years of a suburb stay together. On the training suburbs I scored every model three ways: holding out random suburbs (interpolation), holding out whole councils, and holding out a whole band of latitude, which forces the model to predict a part of the city it has never seen.

<div id="f3-controls" class="cf-controls"></div>
<div id="f3" class="cf-figure" style="height:340px"></div>
<div class="p5-button-description">Cross-validated RMSE on the training suburbs, same six inputs for every model. Switch from interpolation to held-out regions and watch the random forest's edge over plain regression (OLS) disappear.
</div>

Within Perth, the random forest is a strong contender, clearly ahead of plain linear regression. But a forest predicts by averaging training examples, so it can never go beyond what it has seen, and that's precisely what you'd need to do in a city with a different MODIS profile. Hold out a latitude band and its edge over linear regression all but vanishes (5.44 against 5.49). The single-hidden-layer network does worse still (6.40), and a Gaussian process never got going.

The winner is a generalised additive model: one smooth spline curve per input, added up, with a ridge penalty. It's the most accurate under all three schemes (5.13 on the held-out band, against 5.44 for the forest on the same inputs), and beyond the training data each curve simply continues in a straight line. Here it is, in full:

{% highlight python %}
gam = make_pipeline(
    StandardScaler(),
    SplineTransformer(n_knots=5, extrapolation="linear"),
    RidgeCV())
{% endhighlight %}

Because it's additive, we can look at each curve on its own.

<div id="f4-controls" class="cf-controls"></div>
<div id="f4" class="cf-figure" style="height:400px"></div>
<div class="p5-button-description">How each input moves the GAM's estimate, compared with a median suburb. Tree and bare ground are varied by replacing other vegetation (the three always sum to 100). Dots: partial residuals of training suburbs; band: 95% bootstrap interval; grey zones: beyond the training data.
</div>

Going from a sparse suburb to a leafy one (5th to 95th percentile of MODIS tree cover) adds about 6 points of canopy. The two uncertainty layers are more interesting. Where NASA's 30 sub-models disagree, the estimate goes down by 5 to 8 points: disagreement flags mixed urban pixels, where tree cover alone overstates what's there. Bigger suburbs, which tend to be peri-urban, lose about 7 points. And the dots show where the evidence is: mostly below 20% tree cover, which is why the band fans out above 30%.

So, does it work? Press the button.

<div id="f5-controls" class="cf-controls"></div>
<div id="f5" class="cf-figure" style="height:520px"></div>
<div class="p5-button-description">
Apply the correction: each point moves from raw MODIS to the GAM's out-of-fold estimate.
</div>

The cloud slides onto the diagonal, and the fit line's slope goes to 0.99. On the 80 validation suburbs, which played no part in fitting or choosing the model, the error drops from 5.95 to 4.29 points, **28% lower** (95% CI 17–40%). The gain splits about evenly between removing the bias (−2.9 → +0.6 points) and tightening the scatter. Ranking improves too: the rank correlation with WA within a survey year rises from 0.59 to 0.71, in every year.

Where does it help?

<div id="f6" class="cf-figure" style="height:640px"></div>
<div class="p5-button-description">
Change in RMSE per suburb, raw MODIS minus GAM (out-of-fold, all survey years). Blue: the GAM does better. Orange: worse. Hatched: not modelled (WA measured under 80% of the suburb).
</div>

In 71% of suburbs, mostly the established inner and middle ones. The orange is worth a look too, and we'll come back to it.

Finally, zoom out. Refit the same model on local government areas instead of suburbs, and the gain jumps.

<div id="f7-controls" class="cf-controls"></div>
<div id="f7" class="cf-figure" style="height:460px"></div>
<div class="p5-button-description">Error per unit against its size in MODIS pixels, for suburbs and local government areas. The same correction, refit at each level, removes more of the error for councils.
</div>

For suburbs, cross-validated error goes from 6.49 to 4.60 (−29%). For councils, from 6.45 to 3.59 (−44%). Raw MODIS is no better at council level. What changes is the *kind* of error: averaging over thousands of pixels cancels the random part and leaves the bias, which is exactly what a calibration removes. The flip side matters for suburbs: a large share of their remaining error is suburb-specific noise that no calibration can fix. Only finer inputs can. (With 31 councils this is about accuracy for regional reporting; council rankings didn't improve.)

# What's left has a geography

Plot each suburb's error against latitude and a pattern appears.

<div id="f8-controls" class="cf-controls"></div>
<div id="f8" class="cf-figure" style="height:440px"></div>
<div class="p5-button-description">Mean error per suburb against latitude. Line: mean of 10 equal-count latitude bands, ±95% CI.
</div>

Raw MODIS is about right in the far south (Peel), reads 5–6 points low across central Perth, and overestimates in the far north. The GAM removes most of the central dip, but it still overestimates the northernmost suburbs by about 4 points. The pattern is real: given latitude as an extra input, a model gains about half a point of RMSE even when whole regions are held out. I left it out anyway, because a latitude term is a Perth-specific lookup table, not a MODIS correction.

My first suspect was viewing angle: MODIS sees each pixel from varying angles, and steep views can distort cover estimates. NASA's MOD13Q1 product records the angle for every pixel, so I checked. It varies east–west rather than north–south, errors don't grow with it, and it adds nothing as an input.

So the honest answer is that I don't know yet. My best guesses:
- **Central Perth:** mature trees scattered through small lots, too fine for a 232 m pixel to see.
- **The far north:** recent estates on the coastal plain, with young street trees and remnant banksia and heath that are dense but below 3 m. MODIS can count them as tree cover; WA's height threshold excludes them.
- **Underneath both:** soil brightness, lot sizes and the age of development all change along the same north–south gradient.

# A note on time

There's one thing I've swept under the rug so far: everything above is about *levels* in a given year. What about change?

<div id="f9" class="cf-figure"></div>
<div class="p5-button-description">
Twelve suburbs picked by rule: the four largest measured gains and losses 2014–2024, and four roughly stable ones (one per latitude quartile). Click the legend to toggle series.
</div>

The correction moves each suburb to roughly the right level, but it doesn't follow the trend. Across 344 suburbs, the 2014–2024 change in the GAM's estimate correlates with WA's measured change at just 0.21, no better than raw MODIS (0.22). A calibration fitted on levels says little about change; that would need its own model, trained on year-to-year differences.

# Takeaway

A few smooth curves turn MOD44B from a biased canopy estimate into a usable one: errors fall by about a quarter for suburbs and almost half for councils, and the rankings improve. That makes corrected MODIS good for comparing suburbs, ranking them, and reporting by council. It doesn't make it a substitute for WA's survey when you need a precise suburb figure, or when you want to know whether canopy is growing.

If this were a real product, my next steps would be:
- **Test the shrub hypothesis:** WA also publishes shrub cover (0.5–3 m). If MODIS's northern overestimate tracks it, the 3 m threshold is the culprit.
- **Bring in urban form:** building footprints, lot sizes and development age, to test the mixed-pixel and young-tree explanations.
- **Go beyond Perth and beyond MODIS:** ground truth from other cities to test extrapolation properly, and finer inputs (Sentinel-2, canopy-height maps) to shrink the noise no calibration can touch.

<hr style="border:0; border-top: dotted; margin:30px">

*Data: tree canopy from the Western Australian Department of Planning, Lands and Heritage (Urban Forest data, CSIRO Urban Monitor); MODIS MOD44B v061 Vegetation Continuous Fields (NASA LP DAAC, [doi:10.5067/MODIS/MOD44B.061](https://doi.org/10.5067/MODIS/MOD44B.061)), processed in Google Earth Engine; suburb and council outlines from Overture Maps, © OpenStreetMap contributors (ODbL).*

<script>cfCharts.setBase("{{ 'assets/recalibrating-modis/' | relative_url }}");</script>
<script src="{{ 'js/recalibrating_modis/maps.js' | relative_url }}"></script>
<script src="{{ 'js/recalibrating_modis/scatter.js' | relative_url }}"></script>
<script src="{{ 'js/recalibrating_modis/models.js' | relative_url }}"></script>
<script src="{{ 'js/recalibrating_modis/effects.js' | relative_url }}"></script>
<script src="{{ 'js/recalibrating_modis/units.js' | relative_url }}"></script>
<script src="{{ 'js/recalibrating_modis/latitude.js' | relative_url }}"></script>
<script src="{{ 'js/recalibrating_modis/time.js' | relative_url }}"></script>
