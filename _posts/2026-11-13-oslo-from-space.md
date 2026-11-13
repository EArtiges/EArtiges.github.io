---
layout: post
title:  "Oslo from space: do neighbourhoods that look alike ride alike?"
date:   2026-11-13 00:00:00 +0000
categories: mobility gis machine-learning
summary: "Where we learn what a satellite embedding is, how to group a city's neighbourhoods with it and whether neighbourhoods that look alike from space ride alike"
description: "Google's AlphaEarth summarises every 10 m of land on Earth in 64 numbers. Grouped by those numbers alone, without a single bike trip, Oslo's neighbourhoods split into parts of the city that cycle very differently."
image: https://eartiges.github.io/assets/oslo-from-space/card.png
echarts: true
---

<div id="os-header" class="cf-figure" style="border:none"></div>

Transportation planners describe neighbourhoods with place data: how many people live there, how many shops, offices and cafés it has, how many kilometres of cycle lanes run through it. That data is built city by city, from sources that change from one country to the next. Satellite embeddings could be a shortcut: [AlphaEarth Foundations](https://arxiv.org/abs/2507.22291), from Google and Google DeepMind, summarises every 10 m of land on Earth in 64 numbers, every year, and the whole dataset is free to use.

Before putting them into any model, we can ask a simpler question: if we group Oslo's neighbourhoods only by what they look like from space, without a single bike trip, do the groups mean anything for how people cycle?

# 64 numbers per pixel
<div class="post-section">

The 64 numbers are not labels: no single one of them stands for "park" or "offices". A model learned them from satellite imagery (Sentinel-1 and 2, Landsat and more) to summarise what is on the ground and how it changes through the year, so that places that look and behave alike get similar numbers.

We use the grid of [the eleven habits of a cycling city]({% post_url 2026-10-30-eleven-habits-of-a-cycling-city %}): Oslo's city-bike stations grouped into 70 hexagonal H3 cells of about 0.7 km². To give a cell one embedding, we average the ~5,300 pixels it contains and rescale the result to unit length. The banner shows the 2025 embeddings in false colour: their first three principal components as red, green and blue, so cells of similar colour have similar embeddings.

On its own, the embedding already knows something about cycling: out of fold, a linear model on a cell's 2023 embedding predicts how many trips leave it (on a log scale) with R² 0.57.

</div>

# Four kinds of neighbourhood
<div class="post-section">

We group the 70 cells with k-means on their embeddings alone. With four groups, each cluster is a recognisable part of the city ([Map 1](#m1)): the dense centre (B), the north and east (A), the greener north and west (C) and the waterfront (D). And they cycle very differently: the 18 cells of the centre start 58% of the trips, the 18 cells of the greener north and west 5%, about a tenth as many trips per cell.

<div id="m1-controls" class="cf-controls"></div>
<div id="m1" class="cf-figure" style="height:740px"></div>
<div class="p5-button-description">
**Map 1.** From the satellite embeddings alone, four clusters separate the dense centre (B), the north and east (A), the greener north and west (C) and the waterfront (D), and they differ in activity: B's 18 cells hold 58% of departures, C's 18 cells 5%. Change the number of clusters with the buttons ([Fig 1](#f1) follows); click a cluster in the legend to fade its cells.
</div>

</div>

# Who rides to whom?
<div class="post-section">

Do the clusters also differ in where their trips go? [Fig 1](#f1) counts the trips from each cluster to each other cluster, hour by hour, from 2023 to 2025. Most trips stay in the centre: trips within B are 36% of all trips, on weekdays and at weekends alike. Raw counts like these mostly show which cluster is biggest, so the chart starts on a different view: each count divided by what the two clusters' departures and arrivals alone would predict ([definition below](#obs-exp)).

Then preferences appear. Over the whole day (drag the slider across all 24 hours; the chart opens on the morning peak), the north and east (A) and the greener north and west (C) exchange more trips than their sizes explain on weekdays (C → A ×1.36, A → C ×1.19), and less so at weekends (×1.17 and ×0.97). The greener north and west and the waterfront (D) do the reverse: well below expected on weekdays (×0.65 and ×0.75), they reach it at weekends (×0.98 and ×1.03). My guess is weekend rides from the greener north and west down to the fjord, but the chart alone can't say.

<div id="f1-controls" class="cf-controls"></div>
<div id="f1" class="cf-figure" style="height:620px"></div>
<div class="p5-button-description">
**Fig 1.** Most trips stay in the centre, but once the clusters' sizes are taken out, the clusters around it have preferences of their own, and some change between weekdays and weekends. Trips from cluster (rows) to cluster (columns), 2023–2025, over the hours picked with the slider; the bars show all trips by hour. "Observed ÷ expected" divides each count by what the row's departures and the column's arrivals alone predict ([definition below](#obs-exp); orange: more than expected, blue: fewer); "Trips per day" shows the averages. The number of clusters follows [Map 1](#m1).
</div>

**Observed ÷ expected.** For $T_{ab}$ trips from cluster $a$ to cluster $b$, with $T_{a\cdot}$ trips leaving $a$, $T_{\cdot b}$ arriving in $b$ and $T$ trips in all, the expected count is $E_{ab} = T_{a\cdot} T_{\cdot b} / T$: the number of trips we would see if each trip chose its destination regardless of where it started, with every cluster keeping its real departures and arrivals. [Fig 1](#f1) shows $T_{ab} / E_{ab}$, so a ratio above 1 means two clusters exchange more trips than their sizes explain. It is the baseline [Savage and Deutsch (1960)](https://econometricsociety.org/publications/econometrica/1960/07/01/statistical-model-gross-analysis-transaction-flows) used for trade between countries, with corrections by [Goodman (1963)](https://www.econometricsociety.org/publications/econometrica/1963/01/01/statistical-methods-preliminary-analysis-transaction-flows), and in transport terms a gravity model with no distance term. That last point is also its limit here: clusters are mostly compact areas, so part of the excess on the diagonal comes from short trips between neighbouring cells.
{: #obs-exp}

</div>

# Do cells that look alike ride alike?
<div class="post-section">

<!-- Numbers (scripts/59_habits_vs_embeddings.py, CityFlux docs City embeddings/habits_vs_embeddings_similarity.md): 66 cells,
     2,145 pairs; Spearman of embedding similarity with habit-profile cosine distance -0.28 (departures), -0.33 (arrivals),
     Mantel p < 0.001; given km -0.09 (p = 0.13) and -0.18 (p = 0.005); 5-nearest agreement 21% / 19% vs 7.7% chance; habit
     distance vs km +0.82 / +0.77, embedding similarity vs km -0.28; embedding similarity vs |difference of log trips|
     -0.37 / -0.31, given km -0.34 / -0.28. Per-cell rho (similarity vs similarity), departures: median 0.34, -0.38 to +0.58. -->

The clusters are coarse. Pair by pair, do two cells that look alike from space also ride alike? For the cell under the pointer, [Fig 2](#f2) shades every other cell by its similarity in the embeddings (left) and in its habits (right): the [habits]({% post_url 2026-10-30-eleven-habits-of-a-cycling-city %}) describe each cell by how many of its departures, or arrivals, belong to each of the eleven. Hover over a cell to pick it.

<div id="f2-controls" class="cf-controls"></div>
<div id="f2" class="cf-figure"></div>
<div class="p5-button-description">
**Fig 2.** Cells that look alike from space only partly ride alike: the two maps agree loosely, and the habits' similarity follows geography more than the embeddings' does. Every other cell shaded by its similarity to the picked cell (it stays picked when the pointer leaves): left, the cosine similarity of the satellite embeddings (2023); right, the cosine similarity of the cells' departure or arrival profiles over the eleven habits (summer 2023). Darkest: most similar. The shading follows the rank among the other cells, not the value, because most pairs of embeddings score above 0.9 (the tooltip gives the value). Grey: the four cells with no trips in summer 2023, which the habits leave out. ρ: the rank correlation between the two views' similarities, over the other cells.
</div>

The two views agree a little. Across the 66 cells with habits, the rank correlation between the embeddings' similarity and the habits' similarity is about 0.3 for both departures and arrivals, and a cell's five most similar cells are the same in the two views about one time in five, against one in thirteen by chance. Most of it is geography: neighbouring cells take part in the same habits, which the embeddings do not follow as closely. With the distance between cells held fixed, little of the agreement is left (0.09 for departures, 0.18 for arrivals).

What the embeddings do follow is how busy a cell is. The more alike two cells look, the smaller the gap between their numbers of departures, and of arrivals, at the same distance too (rank correlation −0.34 for departures and −0.28 for arrivals, with the gap measured on a log scale). So the clusters of [Map 1](#m1) separate busy and quiet parts of the city more than they separate different habits.

</div>

# So, what do the embeddings know?
<div class="post-section">

Do neighbourhoods that look alike from space ride alike? Partly. Without a single trip, the embeddings sort Oslo's cells into parts of the city where a cell starts up to eleven times more trips than in others, and whose trips between each other change from weekdays to weekends. They say much less about which habits a cell takes part in, which follows geography more closely. They don't say why, and some of what looks like a preference is only distance: the clusters are compact, and neighbours exchange more trips. Four clusters is a choice for readability too; switch [Map 1](#m1) to 3, 5 or 6 to see the groups split.

Whether that is enough to forecast trips between two neighbourhoods, hour by hour, and whether it can replace place data built by hand, is the subject of the next posts.

*Data: trips from [Oslo Bysykkel's open data](https://oslobysykkel.no/en/open-data/historical) (NLOD 2.0); the AlphaEarth Foundations Satellite Embedding dataset is produced by Google and Google DeepMind (CC-BY 4.0), read from [Source Cooperative](https://source.coop/tge-labs/aef); basemap © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright) (ODbL), via Protomaps; hexagons from Uber's H3.*

</div>

<script>cfCharts.setBase("{{ 'assets/oslo-from-space/' | relative_url }}"); window.sfIds = { m4: 'm1', f11: 'f1' };</script>
<!-- Shared map module from the habits post: reads hexes.json and basemap.json from this post's assets. -->
<script src="{{ 'js/eleven_habits_of_a_cycling_city/oslo_map.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script src="{{ 'js/cycling_flows_from_satellite_embeddings/common.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script src="{{ 'js/cycling_flows_from_satellite_embeddings/banner_space.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script src="{{ 'js/cycling_flows_from_satellite_embeddings/m4_clusters.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script src="{{ 'js/cycling_flows_from_satellite_embeddings/f11_cluster_hours.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
<script src="{{ 'js/cycling_flows_from_satellite_embeddings/similarity_maps.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>
