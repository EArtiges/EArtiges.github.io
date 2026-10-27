---
layout: post
title:  "Fine-tuning global satellite imagery to local government methodology: Green Canopy Cover in urban Australia"
date:   2026-10-26 18:00:00 +0000
categories: remote-sensing gis machine-learning echarts
echarts: true
image: https://eartiges.github.io/assets/recalibrating-modis/card.png
summary: Where we learn about MOD44B's urban bias, matching satellite years to aerial surveys, and the north–south error a correction can't remove.
---

Is there a way we could leverage a planetary-wide instrument, published every year, to estimate a costly local government's measurement between census years?

<div id="f1-controls" class="cf-controls"></div>
<div id="f1" class="cf-figure" style="height:640px"></div>
<div class="p5-button-description">
<b>Map 1</b> - Tree canopy: WA's aerial survey by suburb (vegetation above 3 m), or NASA's MOD44B tree cover as its native 232 m pixels. Scroll to zoom, drag to pan, hover for values.
</div>

Every year, NASA publishes an instrument called MODIS44b.061: an estimate of how much of each 250m x 250m patch of land over the whole planet is covered by trees. Western Australia publishes something much more precise for Perth and Peel: tree canopy measured suburb by suburb from aerial photos. Initially these two measurements disagree: NASA says Perth's suburbs are barer than they are. By how much, and why? And can a global, open dataset be fine-tuned well enough to match a local methodology at a fine granularity?

# The data

The two datasets we're looking at today are made in very different ways:

| | WA tree canopy | NASA MODIS MOD44B |
|---|---|---|
| Source | Aerial photos, flown in mid-to-late summer | Terra satellite, a year of 16-day composites |
| Resolution | ~20 x 20cm | 232 x 232m pixels |
| What "tree" means | Vegetation taller than 3 m (heights from stereo photos, no LiDAR) | Share of light reaching the ground through tree canopy, predicted by NASA's own models |
| What we'll use | % canopy per suburb (all land uses) | Per-suburb mean of tree, other-vegetation and bare-ground cover (they sum to 100), plus the spread of NASA's 30 sub-models |
| Years | 2014, 2016, 2018, 2020, 2024 | Every year since 2000 |

WA's canopy comes from the [Let's Grow Urban Greening dashboard](https://www.wa.gov.au/government/document-collections/urban-greening-data-perth-and-peel), produced by the Department of Planning, Lands and Heritage with CSIRO's Urban Monitor. WA says its data is comparable year to year from 2014, which gives us a natural starting point. Suburb outlines come from [Overture Maps](https://overturemaps.org/), and for a given year we'll only keep a suburb if WA measured at least 80% of it that year, so both datasets describe the same ground.

Google Earth Engine comes in really handy to access MOD44B, as we can offload it the geocomputation- it will aggregate the pixels to suburb statistics and hand back a neat geoparquet table, which plays very nice with Python.

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

<br>

One subtlety here: the calendars for both datasets are not the same. A MOD44B "year `N`" runs from 6 March of `N` to 5 March of `N+1`, while WA flies its survey in January and February. So the 2024 survey sits at the very end of MOD44B 2023, which is counter-intuitive. Pairing with MOD44B 2024 made no measurable difference, and using MOD44B' previous year results has one practical advantage: it's complete by the time the survey is flown, so a current-year estimate doesn't have to wait a year. For this reason, we'll pair WA year `N` with MOD44B year `N-1`.

# MOD44B' shortcomings: a systematic bias

Let's plot raw MOD44B tree cover against WA's estimate: each point on [Fig 1](#f2) is a suburb and a year. If MOD44B were 100% right, every point would sit on the identity line (dashed grey), and the line of best fit (dashed colored) would align perfectly with it.

<div id="f2-controls" class="cf-controls"></div>
<div id="f2" class="cf-figure" style="height:520px"></div>
<div class="p5-button-description">
<b>Fig 1</b> - One point per suburb and survey year (suburbs with ≥80% measured). Dashed: least-squares fit; grey: 1:1. Most points sit above the 1:1 line: MOD44B underestimates tree canopy cover.
</div>

On average, MOD44B reads about 3% of canopy too low. And for 2024, the fitted line is nearly parallel to the diagonal but shifted up by about 4.6%: that means MOD44B's underestimation is closer to a constant 4.6% offset, which is good news, because offsets are the easier kind of error.

It's also not surprising: after all, the two products don't measure the same thing. WA counts anything taller than 3m seen at a 20x20 cm resolution. MOD44B predicts how much light reaches the ground through a 232 m pixel that, in a suburb, is mostly roofs, roads and lawns. Scattered street and backyard trees would be easily overlooked or underestimated by a model built for that kind of lower resolution.

# Coming up with a correction that can extrapolate

We can train a model to map MOD44B onto WA's canopy. A sensible set of features to begin with is just the six inputs per suburb: the five MOD44B layer means (tree, other vegetation, bare ground, and the two uncertainty layers) plus the suburb's area. I tried richer feature sets too (10/50/90th percentiles for each layer, fed through a 90%-retained-variance PCA), but for the linear and smooth models they didn't beat these six, which have the advantage that anyone can read, understand and interpret them.

Suburbs were split 60/20/20 into training, testing and validation, so that all years of a suburb stay together. On the training suburbs we score every model three ways: holding out random suburbs (interpolation), holding out whole LGAs, and holding out a whole band of latitude, which forces the model to predict a spatially coherent part of the city it has never seen.

<div id="f3-controls" class="cf-controls"></div>
<div id="f3" class="cf-figure" style="height:340px"></div>
<div class="p5-button-description">
<b>Fig 2</b> - Cross-validated RMSE on the training suburbs, same six inputs for every model. As we hold out more signifcant portions of the data, the random forest's overfitting behaviour starts to show: its edge over plain regression (OLS) disappear.
</div>

Within Perth, a classical linear regression (aka Ordinary Least Squares or OLS) beats MOD44b by more than 1% (a relative 15% improvement) and the random forest is a strong contender, clearly ahead of plain linear regression. But a forest predicts by averaging training examples, so it can never go beyond what it has seen, which severely limits its usefulness: we could not use our fine-tuned model in a city with a different MOD44B profile.

The winner is a generalised additive model (GAM): a sum of smooth splines (one curve per input) with a ridge penalty. It's the most accurate under all three schemes (20 to 30% relative improvement), and beyond the training data each curve simply continues in a straight line. It's very straightforward in scikit-learn:

{% highlight python %}
from sklearn.pipeline import make_pipeline
from sklearn.linear_model import RidgeCV
from sklearn.preprocessing import SplineTransformer, StandardScaler


gam = make_pipeline(
    StandardScaler(),
    SplineTransformer(n_knots=5, extrapolation="linear"),
    RidgeCV())
{% endhighlight %}

Do you know what's nice about an additive model? It's explainable: you can look at each curve on its own!

<div id="f4-controls" class="cf-controls"></div>
<div id="f4" class="cf-figure" style="height:400px"></div>
<div class="p5-button-description">
<b>Fig 3</b> - How each input moves the GAM's estimate, compared with a median suburb. Tree and bare ground are varied by replacing other vegetation (the three always sum to 100). Dots: partial residuals of training suburbs; band: 95% bootstrap interval; grey zones: beyond the training data.
</div>

The difference between the most and least leafy suburbs (5th to 95th percentile of MOD44B tree cover) is about 6% of canopy cover. The two uncertainty layers (`Tree cover model SD` and `Bare ground model SD`) are more interesting: where NASA's 30 sub-models disagree the most, the estimate goes down by 5 to 8%. Disagreement acts as a counterweight for tree cover in mixed urban pixels where the real cover is difficult to assess. Bigger suburbs, which tend to be peri-urban, lose about 7%. 

So, how well is the fine-tuned model doing? Check out the improvement on [Fig 4](#f5):

<div id="f5-controls" class="cf-controls"></div>
<div id="f5" class="cf-figure" style="height:520px"></div>
<div class="p5-button-description">
<b>Fig 4</b> - Apply the correction: each point moves from raw MOD44B to the GAM's out-of-fold estimate.
</div>

The cloud slides onto the diagonal, and on the global dataset (all years) correlation goes from 80% to 86%. On the 80 validation suburbs, which played no part in fitting or choosing the model, the error drops from 5.95% to 4.29%, a **28% relative improvement** (95% CI [17 - 40]%). The gain splits between removing the bias from −2.9 to 0.6% (bring the line of best fit closer to the diagonal) and reducing variance (tightening the scatter). Ranking improves too: the rank correlation with WA within a survey year rises from 0.59 to 0.71, in every year.

# Where does it help?

<div id="f6" class="cf-figure" style="height:640px"></div>
<div class="p5-button-description">
<b>Map 2</b> - Change in RMSE per suburb, raw MOD44B minus GAM (out-of-fold, all survey years). Blue: the GAM does better. Orange: worse. Hatched: not modelled (WA measured under 80% of the suburb).
</div>

The model brings an improvement in 71% of suburbs, mostly the established inner and middle ones. It seems to struggle with peri-urban suburbs- a first hypothesis that we'll test in a minute is that the smaller, more numerous urban suburbs are dominating the data and therefore steering the correction.

One way of checking this assumption is to look at the improvement brought by modelling at the Local Governmment Area (LGA) level instead of the suburb level. By aggregating suburbs into larger LGAs, we're abstracting away some of the individual differences and smoothing the overall picture, which should help the model to learn a more general correction instead of an urban-focused one.

<div id="f7-controls" class="cf-controls"></div>
<div id="f7" class="cf-figure" style="height:460px"></div>
<div class="p5-button-description"> 
<b>Fig 5</b> - MOD44B error decreases with admin unit size for both suburbs and local government areas. Using GAM to apply a correction removes more of the error for LGAs.
</div>

Canopy cover is easier to estimate in larger admin units: raw MOD44B is not better at LGA level, but it makes a different *kind* of error: averaging over thousands of pixels reduces variance a lot and surfaces the bias, which is easy enough to remove with re-calibration. For suburbs, cross-validated error reduces by a <b>relative 29%</b>. For LGAs, <b>it reduces by 44%</b>, although the rank correlation with WA did not improve.  What this means for suburbs is that a large share of their remaining error is suburb-specific noise that no calibration can fix. We'll need finer inputs for that.

# What's left is geography

If you're familiar with geospatial analysis, you're probably thinking that I've ignored the entire spatial dimension of this problem so far. Well here we are: after applying a correction that is completely agnostic to the geography of the problem, we can plot each suburb's error against latitude and a pattern seems to appears.

<div id="f8-controls" class="cf-controls"></div>
<div id="f8" class="cf-figure" style="height:440px"></div>
<div class="p5-button-description">
<b>Fig 6</b> - Mean error per suburb against latitude. Line: mean of 10 equal-count latitude bands, ±95% CI.
</div>


Raw MOD44B is about right in the far south (Peel), reads 5–6% low across central Perth, and overestimates in the far north. The GAM removes most of the central dip, but it still overestimates the northernmost suburbs by about 4%. The two ends of the city are also where the residual error is the largest (orange on [Map 2](#f6)): the GAM beats raw MOD44B in only 55% of the northernmost and southernmost quarters of suburbs, against 87% in the middle two quarters. 

Given latitude as an extra input, our GAM reduces its RMSE by less than .1%, and when whole regions are held out of the training set its performance actually degrades sharply, which tends to indicate that while there is some actual information in the latitude, it's likely not a trend that would extrapolate very well. We would not include it in a model for use in other regions of Australia.

Maybe what we're seeing is simply a preference of the model for urban areas because smaller, more numerous urban suburbs dominate the training data and steer the correction? It turns out suburbs of similar size are still overestimated in the north and underestimated in the centre; once location is accounted for, size adds nothing significant. Peri-urban suburbs are just harder (even though they average many more pixels!) which points at what's on the ground (bushland, farmland, scrub below 3m) rather than a lack of examples.

<div id="f10-controls" class="cf-controls"></div>
<div id="f10" class="cf-figure" style="height:640px"></div>
<div class="p5-button-description">
<b>Map 3</b> - Viewing angle shows little correlation with our modelling error. <br>
View angle: MOD13Q1 view zenith, mean over each MODIS year, then over years. <br>
GAM error: estimate − WA canopy (out-of-fold), mean over survey years; magenta overestimates, blue underestimates. <br>
Hatched: not modelled (WA measured under 80% of the suburb).
</div>

You might be suspecting viewing angle plays a role: MOD44B sees each pixel from varying angles, and steep views can distort cover estimates. NASA's MOD13Q1 product records the angle for every pixel, so we can check.  Regressing the viewing angle on suburb coordinates shows that suburb position explains only 14% of the viewing angle; the steepest angles are found over the small, dense inner suburbs (where our error is smallest), which points to views selection based on quality rather than orbit geometry. For full confirmation, we can train a GAM on the 6 features + viewing angle: on the CV hold-out sets, the RMSE improves by .2% on average- viewing angle does not help the model.

<div id="f11-controls" class="cf-controls"></div>
<div id="f11" class="cf-figure" style="height:440px"></div>
<div class="p5-button-description">
<b>Fig 7</b> - There is no clear relationship between errors and viewing angles. One dot per suburb and survey year; dashed line: least-squares fit.
</div>

So the reason for that preference of our model for small, central areas over peri-urban suburbs is not angle, it's not size- it seems like it is tied to location, but in a way that would not generalize. Ideally we would like to find the latent factor that causes this, but it's not obvious. We can make a few guesses:
- **Central Perth:** mature trees scattered through small lots, too fine for a 232 m pixel to see.
- **The far north:** recent estates on the coastal plain, with young street trees and remnant banksia and heath that are dense but below 3 m. MOD44B can count them as tree cover but WA's height threshold might exclude them.
- **Underneath both:** soil brightness, lot sizes and the age of development all change along the same north–south gradient.

# A note on time

The final dimension of this question is temporality: everything above is about *levels* in a given year. What about change?

<div id="f9" class="cf-figure"></div>
<div class="p5-button-description">
<b>Fig 8</b> - Twelve suburbs picked by hand: the four largest measured gains and losses 2014–2024, and four roughly stable ones (one per latitude quartile). Click the legend to toggle series.
</div>

While our correction moves each suburb to roughly the right canopy level, it's not doing a particularly good job at following temporal trends. Across 344 suburbs, the 2014–2024 change in the GAM's estimate correlates with WA's measured change at just 0.21, no better than raw MOD44B (0.22). MODIS and WA disagree on the evolution of the tree cover, and our model builds an estimate based on MODIS values, so it's having a hard time recovering the trend.

# So, is corrected MODIS good enough?

A few smooth curves turn MOD44B from a biased canopy estimate into a usable one: errors fall by over a quarter for suburbs and almost half for LGAs, and suburb rankings improve. Good enough for static use cases like comparing suburbs, rank them, and report by LGA. Not good enough to replace WA's survey when you need a precise suburb figure, or when you want to know whether canopy is growing- [Fig 8](#f9) shows our model, built without any temporal awareness, has pretty serious limitations as a forecasting tool.

If this were a real product, next steps would probably include:
- **Test the shrub hypothesis:** WA also publishes shrub cover (0.5–3 m). If MOD44B's northern overestimate tracks it, the 3 m threshold is the culprit for that peri-urban suburb extra difficulty.
- **Bring in urban form:** building footprints, lot sizes and development age, to test the mixed-pixel and young-tree explanations.
- **Go beyond Perth and beyond MODIS:** ground truth from other cities to test extrapolation properly, and finer inputs (Sentinel-2, canopy-height maps) to shrink the noise no calibration can touch.
- **Improve on time**: A possibility for poor performance on the trend aspect is that we've trained our model without giving it any awareness of temporality. We could investigate adding a 1-year lag feature (last year's WA canopy cover), or build a year-on-year difference model and pass its output to our GAM.

And we would probably recommend:
- **Stick with the better scale**: our model performs a lot better at the LGA level than at the suburb level. We'd recommend sticking with LGA for now- if there was a strong demand for suburbs, we'd recommend shipping with a caveat while we're working on a solution.
- **Do not use current year estimate as a forecast**: until we've made our model time-aware, it's not fit for a forecasting job. Use it for comparisons, ranking and extrapolations on suburbs/LGAs in the region, but not as a trend estimate.

<hr style="border:0; border-top: dotted; margin:30px">

*Data: tree canopy from the Western Australian Department of Planning, Lands and Heritage (Urban Forest data, CSIRO Urban Monitor); MODIS MOD44B v061 Vegetation Continuous Fields (NASA LP DAAC, [doi:10.5067/MODIS/MOD44B.061](https://doi.org/10.5067/MODIS/MOD44B.061)), processed in Google Earth Engine; suburb and LGA outlines from Overture Maps, © OpenStreetMap contributors (ODbL).*

<script>cfCharts.setBase("{{ 'assets/recalibrating-modis/' | relative_url }}");</script>
<script src="{{ 'js/recalibrating_modis/maps.js' | relative_url }}"></script>
<script src="{{ 'js/recalibrating_modis/scatter.js' | relative_url }}"></script>
<script src="{{ 'js/recalibrating_modis/models.js' | relative_url }}"></script>
<script src="{{ 'js/recalibrating_modis/effects.js' | relative_url }}"></script>
<script src="{{ 'js/recalibrating_modis/units.js' | relative_url }}"></script>
<script src="{{ 'js/recalibrating_modis/latitude.js' | relative_url }}"></script>
<script src="{{ 'js/recalibrating_modis/angle.js' | relative_url }}"></script>
<script src="{{ 'js/recalibrating_modis/time.js' | relative_url }}"></script>
