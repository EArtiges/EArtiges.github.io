/* Fig 11: trips between clusters as an origin-destination matrix (rows: from, columns: to), over a
   range of hours picked with one two-handle slider, which sits right above the bars of all trips by
   hour and spans exactly their width (the picked hours in colour). Two views:
   - "Observed ÷ expected" (default): trips from a to b divided by what a's departures and b's
     arrivals alone predict (row total × column total ÷ grand total), so the busiest cluster no
     longer fills the matrix. Diverging colours on a log scale: orange above 1, blue below.
   - "Trips per day": the average trips per day.
   The number of clusters follows Map 4 (event 'sf-k'). */
// Element id: 'f11' in the long draft; a page can rename it with window.sfIds = { f11: '...' } before loading.
var ID_F11 = (window.sfIds && window.sfIds.f11) || 'f11';
cfCharts.load('f11_cluster_hours.json').then(function (d) {
  var MODES = ['Observed ÷ expected', 'Trips per day'];
  var k = '4', day = 'Weekday', mode = MODES[0], h0 = 7, h1 = 9;   // hours [h0, h1), local time
  var BARS = 70, TOP = 18, GAP = 86, BAR_LEFT = 40, BAR_RIGHT = 12, THUMB = 18;

  var fig = ehMap.sized(ID_F11, function (W) {
    var side = Math.min(W - 66, 440);   // room on the left for the "From" labels
    return { height: TOP + BARS + GAP + side + 16, side: side, left: Math.max(54, Math.round((W - side) / 2 + 20)) };
  }, function (layout) { return cfCharts.chart(ID_F11, function () {
    var L = layout(), n = +k, key = day.toLowerCase(), per = day === 'Weekday' ? 'weekday' : 'weekend day';
    var lift = mode === MODES[0];
    var byHour = [], M = [], R = [], C = [], total = 0, max = 0;
    for (var h = 0; h < 24; h++) byHour.push(0);
    for (var a = 0; a < n; a++) { M.push([]); R.push(0); C.push(0); for (var b = 0; b < n; b++) M[a].push(0); }
    d.pairs[k].forEach(function (r) {
      r[key].forEach(function (v, h) {
        byHour[h] += v;
        if (h >= h0 && h < h1) { M[r.a][r.b] += v; R[r.a] += v; C[r.b] += v; total += v; }
      });
    });
    // cells: [to, from, trips, expected]
    var cells = [];
    M.forEach(function (row, a) { row.forEach(function (v, b) { max = Math.max(max, v); cells.push([b, a, v, R[a] * C[b] / total]); }); });
    var LET = sfMap.LETTERS.slice(0, n).split('');
    var rich = {}; LET.forEach(function (l, c) { rich['c' + c] = { color: sfMap.clusterColor(c), fontWeight: 700, fontSize: 13 }; });
    var lab = function (v, c) { return '{c' + c + '|' + v + '}'; };
    var span = h1 - h0 === 24 ? 'all day' : ehMap.hour(h0) + '–' + ehMap.hour(h1);
    var fmtTrips = function (v) { return v >= 10 ? v.toFixed(0) : v.toFixed(1); };
    var DIV = ehMap.div(), CAP = Math.log(2.5);   // full colour at ×2.5 and ÷2.5
    // t in [0, 1] for the fill's strength, and the fill itself
    var shade = function (v, e) {
      if (!lift) { var s = Math.sqrt(v / max); return [s, cfCharts.rgba('accent', 0.04 + 0.91 * s)]; }
      var x = e > 0 && v > 0 ? Math.max(-1, Math.min(1, Math.log(v / e) / CAP)) : -1;
      return [Math.abs(x), echarts.color.lerp((x + 1) / 2, DIV)];
    };
    var my = TOP + BARS + GAP;
    return Object.assign(cfCharts.base(), {
      title: [{ text: (lift ? 'Trips ÷ expected from the totals, ' : 'Trips per ' + per + ', ') + span,
                left: 'center', top: TOP + BARS + 26, textStyle: { fontSize: 13, fontWeight: 600, color: cfCharts.c('ink') } }],
      grid: [{ left: BAR_LEFT, right: BAR_RIGHT, top: TOP, height: BARS },
             { left: L.left, top: my, width: L.side, height: L.side }],
      tooltip: cfCharts.tooltip({ trigger: 'item', confine: true, formatter: function (p) {
        if (p.seriesId === 'hours') return ehMap.hour(p.dataIndex) + '–' + ehMap.hour(p.dataIndex + 1) + '<br><b>' +
          p.value.toFixed(0) + '</b> trips per ' + per + ', all cells';
        var v = p.value, s = 'From <b>' + LET[v[1]] + '</b> to <b>' + LET[v[0]] + '</b>, ' + span + '<br>';
        if (lift) s += '<b>' + (v[2] / v[3]).toFixed(2) + '</b> times the trips expected from ' + LET[v[1]] +
          '’s departures and ' + LET[v[0]] + '’s arrivals<br>';
        return s + '<b>' + v[2].toFixed(1) + '</b> trips per ' + per + (lift ? ' (expected ' + v[3].toFixed(1) + ')' : '') +
               '<br>' + (100 * v[2] / total).toFixed(1) + '% of trips in those hours';
      } }),
      xAxis: [
        { type: 'category', gridIndex: 0, data: byHour.map(function (_, h) { return ehMap.hour(h); }), axisTick: { show: false },
          axisLine: { lineStyle: { color: cfCharts.c('muted') } }, axisLabel: { color: cfCharts.c('text-secondary'), fontSize: 10, interval: 2 } },
        { type: 'category', gridIndex: 1, position: 'top', data: LET, name: 'To', nameLocation: 'middle', nameGap: 24,
          nameTextStyle: { color: cfCharts.c('text-secondary') }, axisTick: { show: false }, axisLine: { show: false },
          axisLabel: { formatter: lab, rich: rich } },
      ],
      yAxis: [
        cfCharts.axis('', { gridIndex: 0, splitNumber: 2, axisLabel: { color: cfCharts.c('text-secondary'), fontSize: 10 } }),
        { type: 'category', gridIndex: 1, inverse: true, data: LET, name: 'From', nameLocation: 'middle', nameGap: 26,
          nameTextStyle: { color: cfCharts.c('text-secondary') }, axisTick: { show: false }, axisLine: { show: false },
          axisLabel: { formatter: lab, rich: rich } },
      ],
      series: [
        { id: 'hours', type: 'bar', xAxisIndex: 0, yAxisIndex: 0, barCategoryGap: '15%',
          data: byHour.map(function (v, h) {
            return { value: v, itemStyle: { color: h >= h0 && h < h1 ? cfCharts.c('accent') : cfCharts.rgba('muted', 0.35) } };
          }) },
        { id: 'matrix', type: 'custom', xAxisIndex: 1, yAxisIndex: 1, data: cells, encode: { x: 0, y: 1, tooltip: 2 },
          renderItem: function (params, api) {
            var p = api.coord([api.value(0), api.value(1)]), w = api.size([1, 1]), v = api.value(2), e = api.value(3);
            var sh = shade(v, e), x = p[0] - w[0] / 2 + 1.5, y = p[1] - w[1] / 2 + 1.5;
            var text = lift ? (e > 0 ? '×' + (v / e).toFixed(2) : '–') : fmtTrips(v);
            return { type: 'group', children: [
              { type: 'rect', shape: { x: x, y: y, width: w[0] - 3, height: w[1] - 3, r: 2 }, style: { fill: sh[1] } },
              { type: 'text', style: { x: p[0], y: p[1], text: text, align: 'center', verticalAlign: 'middle',
                fontSize: n > 5 ? 11 : 13, fill: sh[0] > 0.6 ? cfCharts.c('bg') : cfCharts.c('ink') } }] };
          } },
      ],
    });
  }); });

  // One slider, two handles: the start and end of the hour range (at least one hour apart). Placed
  // between the controls and the chart, inset so that a handle's centre at value h sits on the boundary
  // before hour h of the bars below: the track runs from BAR_LEFT - THUMB/2 to BAR_RIGHT - THUMB/2.
  (function () {
    if (!document.getElementById('sf-dual-style')) {
      var st = document.createElement('style'); st.id = 'sf-dual-style';
      var thumb = 'pointer-events:auto;width:18px;height:18px;border-radius:50%;background:var(--cf-accent);' +
                  'border:2px solid var(--cf-bg);box-shadow:0 0 0 1px var(--cf-muted);cursor:pointer;';
      st.textContent = '.sf-dual{position:absolute;left:0;top:0;width:100%;height:28px;margin:0;background:none;' +
        'pointer-events:none;-webkit-appearance:none;appearance:none}' +
        '.sf-dual::-webkit-slider-runnable-track{background:none;border:none}' +
        '.sf-dual::-webkit-slider-thumb{-webkit-appearance:none;' + thumb + '}' +
        '.sf-dual::-moz-range-track{background:none}.sf-dual::-moz-range-thumb{' + thumb + '}';
      document.head.appendChild(st);
    }
    var track = document.createElement('div');
    track.style.cssText = 'position:relative;height:28px;margin:6px ' + (BAR_RIGHT - THUMB / 2) + 'px 0 ' + (BAR_LEFT - THUMB / 2) + 'px';
    var rail = document.createElement('div'), fill = document.createElement('div');
    rail.style.cssText = 'position:absolute;left:9px;right:9px;top:12px;height:4px;border-radius:2px;background:var(--cf-rule)';
    fill.style.cssText = 'position:absolute;top:12px;height:4px;border-radius:2px;background:var(--cf-accent)';
    track.appendChild(rail); track.appendChild(fill);
    var mk = function (v, label) {
      var i = document.createElement('input'); i.type = 'range'; i.min = 0; i.max = 24; i.step = 1; i.value = v;
      i.className = 'sf-dual'; i.setAttribute('aria-label', label); track.appendChild(i); return i;
    };
    var lo = mk(h0, 'First hour'), hi = mk(h1, 'Last hour');
    var show = function () {
      fill.style.left = 'calc(9px + (100% - 18px) * ' + h0 / 24 + ')';
      fill.style.width = 'calc((100% - 18px) * ' + (h1 - h0) / 24 + ')';
      lo.style.zIndex = h0 >= 12 ? 2 : 1;   // when the handles meet, the one that can still move is on top
    };
    lo.addEventListener('input', function () { h0 = Math.min(+lo.value, h1 - 1); lo.value = h0; show(); fig.update(); });
    hi.addEventListener('input', function () { h1 = Math.max(+hi.value, h0 + 1); hi.value = h1; show(); fig.update(); });
    show();
    var chartEl = document.getElementById(ID_F11);
    chartEl.parentNode.insertBefore(track, chartEl);
  })();
  cfCharts.buttons(ID_F11 + '-controls', MODES, function (v) { mode = v; fig.update(); }, mode);
  cfCharts.buttons(ID_F11 + '-controls', ['Weekday', 'Weekend'], function (v) { day = v; fig.update(); }, day);
  window.addEventListener('sf-k', function (e) { k = e.detail; fig.update(); });
});
