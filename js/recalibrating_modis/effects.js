/* F4: GAM partial effects, one input at a time, with 95% band and extrapolation zones. */
cfCharts.load('f4_effects.json').then(function (d) {
  var i = 0;
  var short = d.panels.map(function (p) { return p.title; });
  var fig = cfCharts.chart('f4', function () {
    var p = d.panels[i];
    var pairs = function (ys) { return p.grid.map(function (x, k) { return [x, ys[k]]; }); };
    var x0 = p.grid[0], x1 = p.grid[p.grid.length - 1];
    var span = function (a, b) { return p.log ? Math.log(b) - Math.log(a) : b - a; };
    var zone = function (a, b) {
      var wide = span(a, b) > 0.08 * span(x0, x1);
      return [{ xAxis: a, label: { show: wide } }, { xAxis: b }];
    };
    var zones = [];
    if (p.train_min > x0) zones.push(zone(x0, p.train_min));
    if (p.train_max < x1) zones.push(zone(p.train_max, x1));
    // y-range from the curve and band inside the training range; extrapolated parts are clipped.
    var inside = p.grid.map(function (x) { return x >= p.train_min && x <= p.train_max; });
    var vals = [];
    p.grid.forEach(function (_, k) { if (inside[k]) vals.push(p.lo[k], p.hi[k], p.fitted[k]); });
    var ry = p.points.map(function (q) { return q[1]; }).sort(function (a, b) { return a - b; });
    vals.push(ry[Math.floor(0.02 * ry.length)], ry[Math.floor(0.98 * ry.length)]);
    var ymin = Math.min.apply(null, vals), ymax = Math.max.apply(null, vals), pad = 0.1 * (ymax - ymin);
    ymin = Math.floor((ymin - pad) / 5) * 5; ymax = Math.ceil((ymax + pad) / 5) * 5;
    return Object.assign(cfCharts.base(), {
      grid: { left: 60, right: 20, top: 30, bottom: 50 },
      tooltip: cfCharts.tooltip({ trigger: 'axis', formatter: function (ps) {
        // Read the curve at the grid point nearest the cursor's x (series indices differ between dots, band and curve).
        var xv = ps.length ? Number(ps[0].axisValue) : NaN;
        if (!isFinite(xv)) return '';
        var dist = function (v) { return Math.abs(p.log ? Math.log(v) - Math.log(xv) : v - xv); };
        var k = p.grid.reduce(function (best, v, j) { return dist(v) < dist(p.grid[best]) ? j : best; }, 0);
        var x = p.grid[k];
        var where = x < p.train_min || x > p.train_max ? '<br><i>extrapolating</i>' : '';
        return p.label + ': <b>' + x.toFixed(1) + '</b><br>effect ' + (p.fitted[k] >= 0 ? '+' : '') +
          p.fitted[k].toFixed(1) + ' pts<br>95% band ' + p.lo[k].toFixed(1) + ' to ' + p.hi[k].toFixed(1) + where;
      } }),
      xAxis: cfCharts.axis(p.label, { type: p.log ? 'log' : 'value', min: x0, max: x1,
                                axisLabel: { color: cfCharts.c('text-secondary'), formatter: function (v) { return +v.toFixed(1); } } }),
      yAxis: cfCharts.axis('Effect on estimated canopy (pts)', { nameGap: 40, min: ymin, max: ymax }),
      series: [
        { id: 'residuals', type: 'scatter', silent: true, symbolSize: 3, z: 0,
          itemStyle: { color: cfCharts.c('text-secondary'), opacity: 0.35 }, data: p.points },
        cfCharts.band('band', p.grid, p.lo, p.hi, cfCharts.rgba('accent', 0.18)),
        { id: 'effect', type: 'line', data: pairs(p.fitted), symbol: 'none', lineStyle: { color: cfCharts.c('accent'), width: 2.5 },
          markLine: { symbol: 'none', silent: true, data: [{ yAxis: 0 }], lineStyle: { color: cfCharts.c('muted'), type: 'dashed' }, label: { show: false } },
          markArea: { silent: true, itemStyle: { color: cfCharts.rgba('muted', 0.18) },
                      label: { show: true, position: 'insideTop', color: cfCharts.c('text-secondary'), formatter: 'extrapolation' },
                      data: zones } },
      ],
    });
  });
  cfCharts.buttons('f4-controls', short, function (v) { i = short.indexOf(v); fig.redraw(); }, short[0]);
});
