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
  function url(name) { return dataBase + name; }
  function load(name) { return fetch(url(name)).then(function (r) { return r.json(); }); }

  // redraw(): full rebuild (theme switch). update(): merge, so ECharts animates between states.
  function chart(id, render) {
    var ch = echarts.init(document.getElementById(id), null, { renderer: 'canvas' });
    var redraw = function () { ch.setOption(render(), { notMerge: true }); };
    var update = function () { ch.setOption(render(), { replaceMerge: ['series'] }); };
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

  return { c: c, rgba: rgba, neutral: neutral, setBase: setBase, url: url, load: load, chart: chart,
           buttons: buttons, base: base, tooltip: tooltip, axis: axis, pct: pct, band: band };
})();
