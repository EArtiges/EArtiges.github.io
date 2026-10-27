/* F2: raw MODIS vs WA canopy. F5: the same, with a button that applies the GAM correction. */
cfCharts.load('f2_scatter.json').then(function (d) {
  var rmse = function (rows, key) {
    return Math.sqrt(rows.reduce(function (s, r) { return s + Math.pow(r[key] - r.wa, 2); }, 0) / rows.length);
  };

  // Least-squares line of WA canopy on the displayed estimate, drawn across the plotted range,
  // labelled with Pearson's r of the displayed points.
  function fitLine(rows, key) {
    var n = rows.length, mx = 0, my = 0, sxy = 0, sxx = 0, syy = 0;
    rows.forEach(function (r) { mx += r[key] / n; my += r.wa / n; });
    rows.forEach(function (r) {
      sxy += (r[key] - mx) * (r.wa - my); sxx += Math.pow(r[key] - mx, 2); syy += Math.pow(r.wa - my, 2);
    });
    var b = sxy / sxx, a = my - b * mx, pearson = sxy / Math.sqrt(sxx * syy);
    // Stop the line where it leaves the 0-70 box, or ECharts clips its end and the label with it.
    var x1 = a + 70 * b > 70 ? (70 - a) / b : 70;
    return { id: 'fit', type: 'line', symbol: 'none', silent: true, data: [[0, a], [x1, a + x1 * b]],
             lineStyle: { type: 'dashed', width: 2, color: cfCharts.c('accent') },
             endLabel: { show: true, formatter: 'Pearson r = ' + pearson.toFixed(2), color: cfCharts.c('accent'), offset: [-130, -14] } };
  }

  function scatter(id, withCorrection) {
    var year = 'All', key = 'raw';
    var fig = cfCharts.chart(id, function () {
      var rows = year === 'All' ? d.rows : d.rows.filter(function (r) { return r.y === +year; });
      var name = key === 'raw' ? 'Raw MODIS tree cover (%)' : 'GAM estimate (%)';
      return Object.assign(cfCharts.base(), {
        grid: { left: 56, right: 16, top: 40, bottom: 48 },
        title: { text: 'RMSE ' + rmse(rows, key).toFixed(2) + ' pts (' + (year === 'All' ? 'all years' : year) + ')',
                 left: 60, top: 6, textStyle: { fontSize: 13, color: cfCharts.c('ink') } },
        tooltip: cfCharts.tooltip({ trigger: 'item', formatter: function (p) {
          if (p.seriesIndex !== 0) return '';
          var r = p.data.r;
          return '<b>' + r.n + '</b> · ' + r.y + '<br>WA canopy ' + cfCharts.pct(r.wa) + '<br>raw MODIS ' + cfCharts.pct(r.raw) +
            (withCorrection ? '<br>GAM estimate ' + cfCharts.pct(r.gam) : '');
        } }),
        xAxis: cfCharts.axis(name, { min: 0, max: 70 }), yAxis: cfCharts.axis('WA canopy >3 m (%)', { min: 0, max: 70 }),
        series: [
          { id: 'points', type: 'scatter', symbolSize: 5, itemStyle: { color: cfCharts.c('accent'), opacity: 0.55 },
            data: rows.map(function (r) { return { value: [r[key], r.wa], r: r }; }) },
        ].concat([fitLine(rows, key)]).concat([
          { id: 'diagonal', type: 'line', data: [[0, 0], [70, 70]], symbol: 'none', silent: true,
            lineStyle: { type: 'dashed', width: 1, color: cfCharts.c('muted') } },
        ]),
      });
    });
    cfCharts.buttons(id + '-controls', ['All'].concat(d.years.map(String)), function (v) { year = v; fig.update(); }, 'All');
    if (withCorrection) {
      cfCharts.buttons(id + '-controls', ['Raw MODIS', 'Apply correction'], function (v) {
        key = v === 'Raw MODIS' ? 'raw' : 'gam'; fig.update();
      }, 'Raw MODIS');
    }
  }

  scatter('f2', false);
  scatter('f5', true);
});
