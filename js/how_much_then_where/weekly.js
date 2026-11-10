/* Fig 1: weekly trips in summer 2023 (training weeks in grey, test weeks in ink) and each method's
   forecast for the test weeks. */
cfCharts.load('f1_weekly.json').then(function (d) {
  var test = {}; d.test.forEach(function (w) { test[w] = true; });
  var onTest = function (vals) {          // forecasts exist for test weeks only
    var k = 0;
    return d.weeks.map(function (w) { return test[w] ? vals[k++] : null; });
  };
  var NAMES = { A: 'A. Average week', B: 'B. Last week × shares', C: 'C. B + seasonal factor' };
  var COLORS = function () { return { A: cfCharts.c('muted'), B: cfCharts.c('accent'), C: cfCharts.c('orange') }; };

  cfCharts.chart('f1', function () {
    var col = COLORS();
    return Object.assign(cfCharts.base(), {
      grid: { left: 64, right: 16, top: 40, bottom: 48 },
      legend: { top: 0, right: 8, textStyle: { color: cfCharts.c('text-secondary') } },
      tooltip: cfCharts.tooltip({ trigger: 'axis', formatter: function (ps) {
        var i = d.weeks.indexOf(+ps[0].axisValue), w = d.weeks[i];
        var lines = ['<b>Week ' + w + '</b> (' + (test[w] ? 'test' : 'training') + ')', 'observed: ' + d.actual[i].toLocaleString('en-GB')];
        if (test[w]) Object.keys(NAMES).forEach(function (k) {
          var f = onTest(d.forecasts[k])[i], err = 100 * (f - d.actual[i]) / d.actual[i];
          lines.push(NAMES[k] + ': ' + f.toLocaleString('en-GB') + ' (' + (err >= 0 ? '+' : '') + err.toFixed(0) + '%)');
        });
        return lines.join('<br>');
      } }),
      xAxis: cfCharts.axis('ISO week, summer 2023', { type: 'category', data: d.weeks, splitLine: { show: false } }),
      yAxis: cfCharts.axis('Trips per week', { nameGap: 50, min: 0 }),
      series: [
        { name: 'Observed', type: 'line', data: d.actual, symbol: 'circle', symbolSize: 8,
          lineStyle: { color: cfCharts.c('ink'), width: 2 },
          itemStyle: { color: function (p) { return test[d.weeks[p.dataIndex]] ? cfCharts.c('ink') : cfCharts.c('muted'); } } },
      ].concat(Object.keys(NAMES).map(function (k) {
        return { name: NAMES[k], type: 'scatter', data: onTest(d.forecasts[k]), symbol: k === 'A' ? 'rect' : 'diamond',
                 symbolSize: 11, itemStyle: { color: col[k] } };
      })),
    });
  });
});
