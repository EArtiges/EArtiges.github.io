/* F3: CV RMSE of five models under three cross-validation schemes. */
cfCharts.load('f3_models.json').then(function (d) {
  var scheme = 0;
  // Fixed order: ascending RMSE under interpolation, so bars move rather than reshuffle across schemes.
  d.models.sort(function (a, b) { return a.rmse[0] - b.rmse[0]; });
  var fig = cfCharts.chart('f3', function () {
    return Object.assign(cfCharts.base(), {
      grid: { left: 150, right: 60, top: 20, bottom: 48 },
      tooltip: cfCharts.tooltip({ trigger: 'item', formatter: function (p) {
        return '<b>' + p.name + '</b><br>' + d.schemes[scheme] + '<br>CV RMSE ' + p.value.toFixed(2) + ' pts';
      } }),
      xAxis: cfCharts.axis('Cross-validated RMSE (percentage points)', { min: 0, max: 7 }),
      yAxis: { type: 'category', data: d.models.map(function (m) { return m.name; }), inverse: true,
               axisLine: { lineStyle: { color: cfCharts.c('muted') } }, axisTick: { show: false },
               axisLabel: { color: cfCharts.c('ink'), fontSize: 13 } },
      series: [{
        id: 'bars', type: 'bar', barWidth: '55%',
        data: d.models.map(function (m) {
          return { value: m.rmse[scheme], itemStyle: { color: m.name === 'GAM' ? cfCharts.c('accent') : cfCharts.rgba('muted', 0.6) } };
        }),
        label: { show: true, position: 'right', color: cfCharts.c('ink'), formatter: function (p) { return p.value.toFixed(2); } },
        markLine: { symbol: 'none', silent: true, data: [{ xAxis: d.baseline }],
                    lineStyle: { color: cfCharts.c('orange'), type: 'dashed', width: 1.5 },
                    label: { formatter: 'raw MODIS ' + d.baseline.toFixed(2), color: cfCharts.c('orange'), position: 'insideEndTop' } },
      }],
    });
  });
  cfCharts.buttons('f3-controls', d.schemes, function (v) { scheme = d.schemes.indexOf(v); fig.update(); }, d.schemes[0]);
});
