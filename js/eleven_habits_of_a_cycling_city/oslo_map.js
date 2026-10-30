/* Shared Oslo map pieces for "The eleven habits of a cycling city" (global `ehMap`).
   Loaded before the figure scripts. A map is one ECharts `geo` holding the basemap
   (water and parks as regions), with major roads, place labels and the H3 hexes drawn
   on top as series, so everything pans and zooms together.

     ehMap.ready.then(function () {
       var opt = { geo: [ehMap.geo({ roam: true })],
                   series: ehMap.base(0).concat([ehMap.hexes('h', 0, values)]) };
     });
*/
window.ehMap = (function () {
  var data = {};
  var ready = Promise.all([cfCharts.load('hexes.json'), cfCharts.load('basemap.json')]).then(function (res) {
    data.hexes = res[0].features.map(function (f) { return f.geometry.coordinates[0]; });
    data.cells = res[0].features.map(function (f) { return f.properties.name; });
    data.base = res[1];
    echarts.registerMap('eh-oslo', res[1].areas);
  });

  // Mercator: conformal, so over a city it keeps shapes — hexes come out as hexagons. ECharts
  // wants screen-like coordinates (y grows downwards), hence the minus sign.
  var RAD = Math.PI / 180;
  var MERCATOR = {
    project: function (p) { return [p[0] * RAD, -Math.log(Math.tan(Math.PI / 4 + p[1] * RAD / 2))]; },
    unproject: function (p) { return [p[0] / RAD, (2 * Math.atan(Math.exp(-p[1])) - Math.PI / 2) / RAD]; },
  };

  // The active cells' extent, grown to a SQUARE in projected units: every map panel is square,
  // and a non-square extent in a square box is exactly what squishes the hexes.
  function squareBounds() {
    var b = data.base.bbox;
    var p0 = MERCATOR.project([b[0], b[3]]), p1 = MERCATOR.project([b[2], b[1]]);
    var cx = (p0[0] + p1[0]) / 2, cy = (p0[1] + p1[1]) / 2;
    var half = Math.max(p1[0] - p0[0], p1[1] - p0[1]) / 2;
    return [MERCATOR.unproject([cx - half, cy - half]), MERCATOR.unproject([cx + half, cy + half])];
  }

  // A square box of side `side` px, horizontally centred in a container `width` px wide.
  function square(width, side, top) {
    return { left: Math.round((width - side) / 2), top: top, width: side, height: side };
  }

  // Container heights depend on its width (square maps), so they are set from JS, before
  // echarts.init and again on resize. `layout(width)` returns { height, ... }.
  // Only a WIDTH change re-lays out, and with a merge (update) rather than a full rebuild: a
  // rebuild replaces the tooltip while one is showing, and ECharts' pending tooltip refresh
  // then writes into the discarded element (a page error, e.g. on any height-only resize).
  function sized(id, layout, build) {
    var el = document.getElementById(id), L, lastW;
    var apply = function () { lastW = el.clientWidth; L = layout(lastW); el.style.height = L.height + 'px'; };
    apply();
    var fig = build(function () { return L; });
    window.addEventListener('resize', function () {
      if (el.clientWidth === lastW) return;
      apply(); fig.chart.resize(); fig.update();
    });
    return fig;
  }

  function geo(extra) {
    return Object.assign({
      map: 'eh-oslo', roam: true, scaleLimit: { min: 1, max: 6 }, projection: MERCATOR,
      boundingCoords: squareBounds(), silent: true, label: { show: false },
      itemStyle: { areaColor: 'transparent', borderWidth: 0 },
      regions: [
        { name: 'water', itemStyle: { areaColor: cfCharts.rgba('blue', 0.16), borderWidth: 0 } },
        { name: 'park', itemStyle: { areaColor: cfCharts.rgba('muted', 0.14), borderWidth: 0 } },
      ],
    }, extra || {});
  }

  // Roads and labels for geo `g`. `labels: false` for small multiples.
  function base(g, opts) {
    opts = opts || {};
    var out = [{
      id: 'roads' + g, type: 'lines', coordinateSystem: 'geo', geoIndex: g, polyline: true, silent: true,
      z: 1, large: true, lineStyle: { color: cfCharts.rgba('muted', 0.45), width: 0.8 },
      data: data.base.roads.map(function (l) { return { coords: l }; }),
    }];
    if (opts.labels !== false) out.push({
      id: 'labels' + g, type: 'scatter', coordinateSystem: 'geo', geoIndex: g, silent: true, z: 5,
      symbolSize: 0, data: data.base.places.map(function (p) { return { name: p.name, value: p.coord }; }),
      label: { show: true, formatter: '{b}', color: cfCharts.c('ink'), fontSize: 11, fontWeight: 600,
               textBorderColor: cfCharts.c('bg'), textBorderWidth: 3 },
    });
    if (opts.roads === false) out.shift();
    return out;
  }

  // One hexagon per cell on geo `g`. `values[i]` is cell i's value; colour comes from the
  // chart's visualMap (api.visual) unless `colorOf(value, i)` is given.
  function hexes(id, g, values, opts) {
    opts = opts || {};
    return Object.assign({
      id: id, type: 'custom', coordinateSystem: 'geo', geoIndex: g, z: 3,
      data: values.map(function (v, i) { return { name: data.cells[i], value: [i, v] }; }),
      dimensions: ['cell', 'value'], encode: { value: 1, tooltip: 1 },
      renderItem: function (params, api) {
        var i = api.value(0), v = api.value(1);
        var pts = data.hexes[i].map(function (c) { return api.coord(c); });
        // `gap` (px): draw each hex as a tile shrunk towards its centre, so the basemap shows
        // through an even "grout" between tiles instead of an outline. Fixed in pixels, so the
        // grout keeps its width at every zoom.
        if (opts.gap) {
          var n = pts.length - 1, cx = 0, cy = 0;
          for (var j = 0; j < n; j++) { cx += pts[j][0]; cy += pts[j][1]; }
          cx /= n; cy /= n;
          pts = pts.map(function (p) {
            var dx = p[0] - cx, dy = p[1] - cy, r = Math.sqrt(dx * dx + dy * dy) || 1, k = Math.max(0, 1 - opts.gap / r);
            return [cx + dx * k, cy + dy * k];
          });
        }
        var fill = opts.colorOf ? opts.colorOf(v, i) : api.visual('color');
        // Transparency lives in the colours (see seq/div), so tiles are drawn fully opaque.
        var alpha = opts.opacity || 1;
        return { type: 'polygon', shape: { points: pts },
                 style: { fill: fill, opacity: alpha, stroke: opts.gap ? null : (opts.stroke || cfCharts.c('bg')),
                          lineWidth: opts.gap ? 0 : 0.6 },
                 emphasis: { style: { stroke: cfCharts.c('ink'), lineWidth: 1.5 } } };
      },
      animation: false,
    }, opts.series || {});
  }

  // Opacity in the colour scale: one colour whose transparency carries the value, so quiet cells
  // let the basemap through and busy ones stay solid. The legend bar fades the same way.
  function seq() { return [cfCharts.rgba('accent', 0.02), cfCharts.rgba('accent', 0.95)]; }
  function seqColor(t) { return echarts.color.lerp(Math.max(0, Math.min(1, t)), seq()); }
  // Diverging, the same idea: colour by sign, opacity by size, so a cell near zero is nearly clear.
  function div() { return [cfCharts.rgba('blue', 0.95), cfCharts.rgba('muted', 0.02), cfCharts.rgba('orange', 0.95)]; }

  // Tiles: the "grout" between hexes is a gap of bare basemap, never an outline. Its width scales
  // with the map panel's height (2.5 px on a 740 px map), and is fixed in pixels under zoom.
  function gap(panelHeight) { return 2.5 * panelHeight / 740; }

  // Maps fill their panel, so the legend sits on the map, on a translucent card.
  function legend(min, max, colors, text, extra) {
    return Object.assign({ type: 'continuous', min: min, max: max, right: 8, bottom: 12, itemHeight: 110,
      itemWidth: 12, calculable: false, text: text, textStyle: { color: cfCharts.c('ink') },
      backgroundColor: cfCharts.rgba('bg', 0.85), padding: 8, borderRadius: 4,
      // Hovering the legend would highlight the matching hexes, which ECharts 5.5 cannot do for
      // custom series (it throws). The hexes' own tooltips carry the values anyway.
      hoverLink: false,
      inRange: { color: colors } }, extra || {});
  }

  // A labelled range input in a controls container; returns the input.
  function slider(containerId, label, min, max, value, fmt, onInput) {
    var wrap = document.createElement('label'), text = document.createElement('span'), input = document.createElement('input');
    wrap.style.cssText = 'display:inline-flex;align-items:center;gap:10px;margin:4px 12px 4px 0;min-width:260px;flex:1';
    input.type = 'range'; input.min = min; input.max = max; input.step = 1; input.value = value;
    input.style.cssText = 'flex:1;accent-color:' + cfCharts.c('accent');
    input.setAttribute('aria-label', label);
    text.style.cssText = 'min-width:7.5em;font-variant-numeric:tabular-nums';
    var show = function () { text.textContent = label + ' ' + fmt(+input.value); };
    input.addEventListener('input', function () { show(); onInput(+input.value); });
    show();
    wrap.appendChild(text); wrap.appendChild(input);
    document.getElementById(containerId).appendChild(wrap);
    input.refresh = show;
    return input;
  }

  // Square map over a time plot half its height (2:1). `top` is the title row, `bottom` the time
  // axis labels. Use as the `layout` of `sized`.
  function stack(top, bottom) {
    return function (W) {
      var S = W, x = Math.round(S / 2), GAP = 34;
      return { height: top + S + GAP + x + bottom, geo: square(W, S, top),
               grid: { left: 56, right: 12, top: top + S + GAP, height: x }, legendTop: top + S + 6 };
    };
  }

  function hour(h) { return (h < 10 ? '0' : '') + h + ':00'; }
  var DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return { ready: ready, data: data, geo: geo, base: base, hexes: hexes, seq: seq, seqColor: seqColor,
           div: div, gap: gap, legend: legend, slider: slider, stack: stack, square: square, sized: sized,
           hour: hour, DAYS: DAYS };
})();
