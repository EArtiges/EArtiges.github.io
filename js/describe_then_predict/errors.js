/* Fig 1: each method's error on the six test weeks at three levels — weekly totals, daily totals and
   individual slots (one-trip rule, decision 0016) — with the ideal model as a dash on the slot level. */
cfCharts.load('f1_errors.json').then(function (d) {
  var LEVELS = ['Weekly total', 'Daily totals', 'Slots (one-trip rule)'];
  var KEYS = ['week_err', 'day_err', 'j1'];
  var NAMES = { A: 'A. Average week', B: 'B. Last week × shares', R0: 'R0. Regressor',
                H: 'H. Last week × regressor', 'H*': 'H*. True volume × regressor' };
  var methods = Object.keys(NAMES).filter(function (k) { return d[k]; });
  var color = function (k) {
    return { A: cfCharts.c('muted'), B: cfCharts.c('orange'), R0: cfCharts.c('magenta'),
             H: cfCharts.c('accent'), 'H*': cfCharts.rgba('accent', 0.4) }[k];
  };

  cfCharts.chart('f1', function () {
    var ideal = methods.map(function (k) { return d[k].ideal; });
    var idealMean = ideal.reduce(function (a, b) { return a + b; }, 0) / ideal.length;
    return Object.assign(cfCharts.base(), {
      grid: { left: 60, right: 16, top: 56, bottom: 40 },
      legend: { top: 0, left: 'center', textStyle: { color: cfCharts.c('text-secondary') } },
      tooltip: cfCharts.tooltip({ trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: function (ps) {
        var j = LEVELS.indexOf(ps[0].axisValue);
        return '<b>' + LEVELS[j] + '</b><br>' + methods.map(function (k) {
          return NAMES[k] + ': ' + (100 * d[k][KEYS[j]]).toFixed(1) + '%' + (j === 2 ? ' (ideal ' + (100 * d[k].ideal).toFixed(1) + '%)' : '');
        }).join('<br>');
      } }),
      xAxis: cfCharts.axis('', { type: 'category', data: LEVELS, splitLine: { show: false } }),
      yAxis: cfCharts.axis('Error (%)', { nameGap: 42, min: 0 }),
      series: methods.map(function (k) {
        return { name: NAMES[k], type: 'bar', data: KEYS.map(function (key) { return +(100 * d[k][key]).toFixed(1); }),
                 itemStyle: { color: color(k) }, barGap: '10%' };
      }).concat([
        // The ideal model only exists at the slot level: one dash across that group of bars.
        { name: 'Ideal model (slots)', type: 'scatter', data: [[2, +(100 * idealMean).toFixed(1)]], z: 5,
          symbol: 'path://M0,0 h100 v2 h-100 z', symbolSize: [220, 3], itemStyle: { color: cfCharts.c('ink') } },
      ]),
    });
  });
});
