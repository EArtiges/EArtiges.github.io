/* Fig 3, a floors chart: A, daily trips over the six test weeks, observed and predicted by the
   average week (A), last week x shares (B) and the weather-corrected forecast (D); B, the day's rain
   between 07:00 and 21:00. */
cfCharts.load('f3_daily.json').then(function (d) {
  var labels = d.dates.map(function (s) { var t = new Date(s); return t.getDate() + '/' + (t.getMonth() + 1); });
  var NAMES = { A: 'A. Average week', B: 'B. Last week × shares', D: 'D. + seasonal factor + weather' };

  cfCharts.chart('f3', function () {
    var F = cfCharts.floors('f3', { heights: [3, 1], right: 16 });
    var col = { A: cfCharts.c('muted'), B: cfCharts.c('accent'), D: cfCharts.c('magenta') };
    var line = function (k) {
      return { name: NAMES[k], type: 'line', xAxisIndex: 0, yAxisIndex: 0, data: d.predicted[k], showSymbol: false,
               lineStyle: { width: 1.8, color: col[k], type: k === 'A' ? 'dashed' : 'solid' }, itemStyle: { color: col[k] } };
    };
    return Object.assign(cfCharts.base(), {
      grid: F.grid, title: F.title, axisPointer: F.axisPointer,
      legend: { top: 0, right: 8, textStyle: { color: cfCharts.c('text-secondary') } },
      tooltip: cfCharts.tooltip({ trigger: 'axis', formatter: function (ps) {
        var i = labels.indexOf(ps[0].axisValue);
        return '<b>' + d.dates[i] + '</b><br>observed: ' + d.actual[i] + '<br>' + Object.keys(NAMES).map(function (k) {
          return NAMES[k] + ': ' + Math.round(d.predicted[k][i]);
        }).join('<br>') + '<br>rain: ' + d.rain[i] + ' mm';
      } }),
      // Week boundaries matter (the days are six separate weeks): label every Monday.
      xAxis: F.xAxis(cfCharts.axis('Day (six test weeks, Mondays labelled)', { type: 'category', data: labels,
        axisLabel: { color: cfCharts.c('text-secondary'), interval: function (i) { return i % 7 === 0; } },
        axisTick: { interval: function (i) { return i % 7 === 0; } },
        splitLine: { show: true, interval: function (i) { return i % 7 === 0; }, lineStyle: { color: cfCharts.c('rule') } } })),
      yAxis: [cfCharts.axis('Trips per day', { gridIndex: 0, nameGap: 50, min: 0 }),
              cfCharts.axis('Rain (mm)', { gridIndex: 1, nameGap: 50, min: 0, splitNumber: 2 })],
      series: [
        { name: 'Observed', type: 'line', xAxisIndex: 0, yAxisIndex: 0, data: d.actual, symbol: 'circle', symbolSize: 5,
          lineStyle: { width: 2, color: cfCharts.c('ink') }, itemStyle: { color: cfCharts.c('ink') } },
        line('A'), line('B'), line('D'),
        { name: 'Rain', type: 'bar', xAxisIndex: 1, yAxisIndex: 1, data: d.rain, barWidth: '60%',
          itemStyle: { color: cfCharts.c('blue') } },
      ],
    });
  });
});
