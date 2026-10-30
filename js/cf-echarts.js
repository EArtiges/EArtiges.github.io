/* Shared glue for ECharts figures in blog posts (global `cfCharts`).
   Loaded by the post layout, after ECharts, when the post's front matter has `echarts: true`.
   Theme colours come from cfTheme (js/theme.js); figures re-render on 'cf-theme-change'.

   In a post:
     <div id="f1-controls" class="cf-controls"></div>
     <div id="f1" class="cf-figure" style="height:520px"></div>
     <script>cfCharts.setBase("{{ 'assets/<slug>/' | relative_url }}");</script>
     <script src="{{ 'js/<slug>/f1.js' | relative_url }}"></script>
   and in f1.js:
     cfCharts.load('f1.json').then(function (d) {
       var fig = cfCharts.chart('f1', function () { return Object.assign(cfCharts.base(), { ...option... }); });
       cfCharts.buttons('f1-controls', ['A', 'B'], function (v) { ...; fig.update(); }, 'A');
     });
*/
window.cfCharts = (function () {
  var dataBase = '';
  var FONT = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

  function c(name) { return cfTheme.hex(name); }
  function rgba(name, a) { return 'rgba(' + cfTheme.rgb(name).join(',') + ',' + a + ')'; }
  function mix(a, b, t) { return a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }); }
  // Faint grey between background and ink: a neutral (e.g. a diverging scale's centre) visible in both modes.
  function neutral() { return 'rgb(' + mix(cfTheme.rgb('bg'), cfTheme.rgb('ink'), 0.1).join(',') + ')'; }

  function setBase(path) { dataBase = path; }
  // The layout loads this file as cf-echarts.js?v=<build time>; data files reuse that version, so a
  // rebuilt post never runs with stale JSON from the browser cache.
  var version = (function () {
    var s = document.currentScript && document.currentScript.src.match(/[?&]v=([^&]+)/);
    return s ? s[1] : '';
  })();
  function url(name) { return dataBase + name + (version ? '?v=' + version : ''); }
  function load(name) { return fetch(url(name)).then(function (r) { return r.json(); }); }

  // ECharts draws a line series' legend icon as a line WITH a marker in the middle, even when the
  // series shows no markers (symbol 'none' falls back to a circle). So for every line series that
  // shows no markers on the chart, its legend entry gets an invisible marker: the icon keeps the
  // line's colour and dash, and nothing the chart doesn't show. Bars and other entries are untouched.
  function lineOnlyLegend(opt) {
    if (!opt.legend || Array.isArray(opt.legend)) return opt;
    var series = [].concat(opt.series || []).filter(function (s) { return s && s.name; });
    // A name is "plain" only if EVERY series carrying it is a marker-less line (a scatter sharing
    // the name keeps its marker in the legend).
    var plain = {};
    series.forEach(function (s) {
      var markerless = s.type === 'line' && (s.showSymbol === false || s.symbol === 'none');
      plain[s.name] = (plain[s.name] === undefined ? true : plain[s.name]) && markerless;
    });
    if (!Object.keys(plain).some(function (n) { return plain[n]; })) return opt;
    var names = opt.legend.data || series.map(function (s) { return s.name; })
      .filter(function (n, i, all) { return all.indexOf(n) === i; });
    opt.legend.data = names.map(function (n) {
      var item = typeof n === 'string' ? { name: n } : n;
      return plain[item.name] ? Object.assign({}, item, { itemStyle: Object.assign({}, item.itemStyle, { opacity: 0 }) }) : item;
    });
    return opt;
  }

  // redraw(): full rebuild (theme switch). update(): merge, so ECharts animates between states.
  function chart(id, render) {
    var ch = echarts.init(document.getElementById(id), null, { renderer: 'canvas' });
    var redraw = function () { ch.setOption(lineOnlyLegend(render()), { notMerge: true }); };
    var update = function () { ch.setOption(lineOnlyLegend(render()), { replaceMerge: ['series'] }); };
    redraw();
    window.addEventListener('cf-theme-change', redraw);
    window.addEventListener('resize', function () { ch.resize(); });
    return { chart: ch, redraw: redraw, update: update };
  }

  // A group of toggle buttons (p5-button style); the pressed one gets aria-pressed="true".
  function buttons(containerId, labels, onClick, initial) {
    var group = document.createElement('span');
    var all = labels.map(function (label) {
      var b = document.createElement('button');
      b.className = 'p5-button'; b.textContent = label; b.setAttribute('aria-pressed', String(label === initial));
      b.onclick = function () {
        all.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        onClick(label);
      };
      group.appendChild(b); return b;
    });
    document.getElementById(containerId).appendChild(group);
  }

  function base() {
    return { backgroundColor: c('bg'), textStyle: { color: c('ink'), fontFamily: FONT }, animationDuration: 600 };
  }
  function tooltip(extra) {
    return Object.assign({ backgroundColor: c('bg'), borderColor: c('ink'), borderWidth: 1,
                           textStyle: { color: c('ink'), fontFamily: FONT, fontSize: 12 } }, extra || {});
  }
  function axis(name, extra) {
    return Object.assign({ type: 'value', name: name, nameLocation: 'middle', nameGap: 30,
      nameTextStyle: { color: c('text-secondary') },
      axisLine: { lineStyle: { color: c('muted') } }, axisLabel: { color: c('text-secondary') },
      splitLine: { lineStyle: { color: c('rule') } } }, extra || {});
  }
  function pct(v) { return v === null || v === undefined ? '–' : v.toFixed(1) + '%'; }

  // Shaded interval between lo and hi along x, drawn as one polygon and clipped to the plot area.
  function band(id, xs, lo, hi, color) {
    var pts = xs.map(function (x, k) { return [x, lo[k], hi[k]]; });
    return { id: id, type: 'custom', silent: true, clip: true, z: 1, data: pts, encode: { x: 0, y: [1, 2] },
      renderItem: function (params, api) {
        if (params.dataIndex !== 0) return null;
        var top = pts.map(function (p) { return api.coord([p[0], p[2]]); });
        var bottom = pts.map(function (p) { return api.coord([p[0], p[1]]); }).reverse();
        return { type: 'polygon', shape: { points: top.concat(bottom) }, style: { fill: color } };
      } };
  }

  // Wide chart: two frames side by side (e.g. a square map beside a time plot) in a figure twice the
  // text width, centred, never wider than the viewport minus 16 px gutters. Each frame is its own
  // chart, so panning/zooming one never spills into the other.
  //   split:   share of the width for the LEFT frame (0.25 = 25/75; 0.5, 1/3 ... work the same)
  //   aspect:  left frame's height / width (1 = square); the right frame takes the same height
  //   stack:   below this container width (px) the frames stack, left on top, full width
  //   stackedRatio: right frame's height / width when stacked
  //   gap:     px between the frames
  // Returns { left, right } (element ids for cfCharts.chart) and onResize(fn), called after the frames
  // are re-laid out on a WIDTH change. Re-render there with update() (a merge), not redraw():
  // a rebuild replaces the tooltip while one is showing and ECharts then throws on its next refresh.
  //   <div id="f3-controls" class="cf-controls"></div>
  //   <div id="f3" class="cf-figure"></div>
  //   var w = cfCharts.wide('f3', { split: 0.25 });
  //   var map = cfCharts.chart(w.left, ...), plot = cfCharts.chart(w.right, ...);
  //   w.onResize(function () { map.update(); plot.update(); });
  function wide(id, opts) {
    opts = Object.assign({ split: 0.25, aspect: 1, stack: 900, stackedRatio: 0.5, gap: 24 }, opts || {});
    var el = document.getElementById(id), lastW, listeners = [];
    var span = 'min(200%, calc(100vw - 32px))';
    el.style.width = span; el.style.marginLeft = 'calc((100% - ' + span + ') / 2)';
    el.style.height = 'auto'; el.style.display = 'flex'; el.style.gap = opts.gap + 'px';
    var left = document.createElement('div'), right = document.createElement('div');
    left.id = id + '-left'; right.id = id + '-right';
    left.style.flex = right.style.flex = 'none';
    el.appendChild(left); el.appendChild(right);
    var apply = function () {
      var W = lastW = el.clientWidth, side = W >= opts.stack;
      var lw = side ? Math.round((W - opts.gap) * opts.split) : W, h = Math.round(lw * opts.aspect);
      el.style.flexDirection = side ? 'row' : 'column';
      left.style.width = lw + 'px'; left.style.height = h + 'px';
      right.style.width = (side ? W - opts.gap - lw : W) + 'px';
      right.style.height = (side ? h : Math.round(W * opts.stackedRatio)) + 'px';
    };
    apply();
    // Registered before the frames' charts exist, so frames are re-sized before the charts resize.
    window.addEventListener('resize', function () {
      if (el.clientWidth === lastW) return;
      apply(); listeners.forEach(function (fn) { fn(); });
    });
    return { left: left.id, right: right.id, onResize: function (fn) { listeners.push(fn); } };
  }

  return { c: c, rgba: rgba, neutral: neutral, setBase: setBase, url: url, load: load, chart: chart,
           buttons: buttons, base: base, tooltip: tooltip, axis: axis, pct: pct, band: band, wide: wide };
})();
