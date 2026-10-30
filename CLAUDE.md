# eartiges.github.io

Emmanuel's personal blog: Jekyll 3.10 via the `github-pages` gem, minima theme, published by GitHub Pages. Posts are written for fun: first person, curious, playful, short and figure-led. New posts are planned with the `/blog-post` skill, which also covers building and reviewing figures.

## Local preview

- `./serve.sh` serves the site with drafts and live reload at http://127.0.0.1:4000. It uses Homebrew's `ruby@3.3` (GitHub Pages builds with Ruby 3.3); gems live in `vendor/bundle` (git-ignored). On a new machine: `brew install ruby@3.3 && ./serve.sh --install`.
- `Gemfile` pins `github-pages ~> 232` so the local build matches production. Don't bump Jekyll independently of it.
- In `_config.yml`, the `exclude:` list *replaces* Jekyll's defaults, which is why it repeats `vendor/`, `Gemfile`, etc. Keep those entries when adding to it, or the build reads installed gems as site content.
- Restart `./serve.sh` after editing `_config.yml` (not reloaded automatically).
- Analytics: GoatCounter (`goatcounter:` in `_config.yml`, `_includes/goatcounter.html`), loaded only when `jekyll.environment == 'production'`, i.e. on GitHub Pages, never in local previews. Dashboard: https://eartiges.goatcounter.com

## Layout

- `_posts/YYYY-MM-DD-<slug>.md` published; `_drafts/<date>-<slug>.md` only visible with `--drafts`.
- Post URLs are `/posts/<slug>/` (`permalink:` in `_config.yml`), independent of categories and date. Don't rename a published post's slug; if you must, add the old path to its `redirect_from:` (jekyll-redirect-from), as the older posts do for their pre-2026-10 URLs.
- `assets/<slug>/` data and images of a post; `js/<name>/` its scripts (`js/<slug_with_underscores>/` for ECharts figures).
- `js/theme.js` defines `cfTheme`, the colour tokens read from `_sass/minima/_theme.scss` (`--cf-*` custom properties) plus the light/dark toggle (`#theme-toggle`, event `cf-theme-change`).
- `posts.md` is the user's private list of post ideas (git-ignored, excluded from the site).
- `_voice.md` is Emmanuel's voice guide (not published: Jekyll skips `_` files). Use it as the author's sample whenever drafting or editing post prose, including with `/clarity`.

## Front matter

`layout: post`, `title`, `date`, `categories`, `summary` ("Where we learn about ..."); optional `image:` (absolute URL, e.g. `https://eartiges.github.io/assets/<slug>/card.png`, 1200×627) for the social card, which replaces the site logo in `og:image` (`_includes/head.html`). The preview text is `description:` if set, else the post's first paragraph (`summary:` is not used), so open the post on a sentence that works as a teaser and keep HTML comments out of the top; `echarts: true` and/or `p5: true` only when the post uses them. MathJax 2 is on every page (`$...$`, `$$...$$`); code blocks use `{% highlight python %} ... {% endhighlight %}`.

## Interactive figures: ECharts (the standard)

- `echarts: true` makes `_layouts/post.html` load ECharts 5.5.1 (pinned, jsDelivr) and `js/cf-echarts.js` before the content. Never add those script tags in a post.
- Markup, in this order:
  ```html
  <div id="f1-controls" class="cf-controls"></div>
  <div id="f1" class="cf-figure" style="height:520px"></div>
  <div class="p5-button-description">
  **Fig 1.** Caption.
  </div>
  ```
  The figure checker relies on the `cf-figure` / `cf-controls` classes and the `<id>-controls` naming. The caption text goes on its own line, with a newline before `</div>`: on one line, Jekyll drops it. Ids follow the caption labels so the text can link to them (`[Map 2](#m2)`): `f1`… for figures, `m1`… for maps, `t1`… for tables.
- At the end of the post: `<script>cfCharts.setBase("{{ 'assets/<slug>/' | relative_url }}");</script>`, then one `<script src>` per figure file, versioned so browsers never run a stale copy: `<script src="{{ 'js/<slug>/f1.js' | relative_url }}?v={{ site.time | date: '%s' }}"></script>`. The server sends no `Cache-Control`, so without `?v=` a browser can keep a stale or half-written file (Jekyll's live reload sometimes serves one mid-rebuild) and the figure silently fails to render. The layout versions `cf-echarts.js` the same way, and `cfCharts.load`/`url` append the same version to data files.
- `cfCharts` (in `js/cf-echarts.js`):
  - `load(file)` fetches JSON from the base;
  - `chart(id, render)` returns `{chart, redraw, update}`, re-rendering on theme change; call `update()` after a button click so ECharts animates;
  - `buttons(containerId, labels, onClick, initial)` builds toggle buttons;
  - styling helpers: `base()`, `tooltip()`, `axis(name, extra)`;
  - `band(id, xs, lo, hi, color)` draws an interval as a clipped polygon (don't use stacked areas on value axes);
  - colour helpers: `c(token)`, `rgba(token, a)`, `neutral()` (a visible grey for diverging centres);
  - formatting: `pct(v)`;
  - `wide(id, opts)` builds a **wide chart** (see below).
- **Map style: tiles with opacity in the scale** (first used in `js/eleven_habits_of_a_cycling_city/oslo_map.js`).
  Choropleth cells are drawn as tiles: one colour whose transparency carries the value (sequential:
  accent from 2% to 95% opacity; diverging: blue / orange by sign, opacity by size, nearly clear at
  zero), so quiet cells let the basemap through and busy ones stay solid. No outlines: the "grout"
  between tiles is a gap of bare basemap, 2.5 px on a 740 px-high map and scaled linearly with each map
  panel's height, fixed in pixels under zoom. Put the alpha in the colour stops (`rgba`), not in an
  `opacity` visual, so the legend bar fades the same way. Maps are square panels on a real projection
  (Mercator) with a basemap extent that is square in that projection, so they fill their panel.
- **Wide chart** (`cfCharts.wide`): the standard layout for a map beside a time plot, or any two
  linked views. The figure is twice the text width, centred (overflowing the text column by half its
  width on each side), and never wider than the viewport minus 16 px gutters. It holds two frames side
  by side, each its own chart, so panning or zooming one never spills into the other. Markup is a
  plain `<div id="f3" class="cf-figure"></div>` (no height: the helper sizes it from its width).
  ```js
  var w = cfCharts.wide('f3', { split: 0.25 });          // left frame 25% of the width
  var map = cfCharts.chart(w.left, ...), plot = cfCharts.chart(w.right, ...);
  w.onResize(function () { map.chart.resize(); plot.chart.resize(); map.update(); plot.update(); });
  ```
  Options: `split` (left share of the width: 0.25 = 25/75, 1/3, 0.5 …), `aspect` (left frame's
  height/width, 1 = square map; the right frame takes the same height), `stack` (below this width in
  px the frames stack, left on top; default 900), `stackedRatio` (right frame's height/width when
  stacked; default 0.5), `gap` (px). Put the figure's title over the right frame, not above the whole
  figure, so the map keeps the full height. When the right frame is narrow (a phone), give its legend
  its own row under the title. First used in `js/eleven_habits_of_a_cycling_city/` (Map 2, Fig 3).
- Colours come from theme tokens: `bg`, `surface`, `ink`, `text-secondary`, `muted`, `rule`, `accent`, `accent-strong`, `accent-tint`, `blue`, `magenta`, `yellow`, `orange`.
  - Use `blue`/`orange` for better/worse or before/after.
  - Never use the background colour as a data colour (the neutral of a diverging scale included).
  - A fixed palette is fine when the meaning demands it, e.g. greens for vegetation, darker = more in both modes.
- Gotchas:
  - `large: true` (needed beyond a few thousand points) draws one colour per series: bin the data by colour.
  - An axis-triggered tooltip's params can come from any series under the cursor: read values from `axisValue`, not `ps[0].dataIndex`.
  - Set a figure's container height before `echarts.init`.
  - On a window resize, re-render with `update()` (a merge), never `redraw()`: a full rebuild replaces
    the tooltip while one is showing, and ECharts' pending tooltip refresh then throws
    ("Cannot set properties of null (setting 'innerHTML')"). The figure checker triggers this on any
    figure taller than its 1000 px viewport, because element screenshots resize the page.
  - Legends: ECharts draws a line series' legend icon with a marker in the middle even when the chart
    shows none. `cfCharts.chart` fixes this for every figure (`lineOnlyLegend`): an entry whose series are
    all marker-less lines (`showSymbol: false` or `symbol: 'none'`) shows the line only. Nothing to do in a
    figure script; just set `showSymbol: false` on lines that draw no points.
  - A continuous `visualMap` driving a `custom` series must set `hoverLink: false`: hovering the legend
    otherwise throws inside ECharts 5.5.
  - Maps: give `geo` a `projection` (e.g. Mercator `{project, unproject}`), not `aspectScale`; with a
    custom projection and a box whose aspect matches the bounds, shapes (H3 hexes) stay undistorted.
  - Jekyll's live reload sometimes serves a stale or half-written JS file after an edit; if a page
    error makes no sense, `curl` the served file and `diff` it against disk, and `touch` it to rebuild.
- Data: one small file per figure in `assets/<slug>/`, generated by an export script in the project repo (never hand-edited); rasters as greyscale PNG; map outlines as GeoJSON, registered with `echarts.registerMap`.

## Checking figures before showing them

With `./serve.sh` running:

```
uv run --no-project --with playwright python ~/.claude/skills/blog-post/scripts/check_figures.py <post URL> --out <scratch dir>
```

It loads the post in light and dark mode, clicks every button of every `cf-figure`, checks tooltips, flips the theme toggle, and reports page errors and missing files. Read the screenshots; fix until clean before handing the preview to the user.

## p5.js sketches (simulations and explorables)

One folder per sketch in `js/<sketch_name>/`, p5 instance mode, canvas attached with `canvas.parent('<div id>')` and given the `p5-animation` class; colours from `cfTheme.rgb(token)`; buttons with `p5-button`, captions with `p5-button-description`; `p5: true` in front matter (the layout loads p5, never add its script tag); load sketch files after their divs with `<script async src=...>`.

## Git

Don't commit or push unless asked.
