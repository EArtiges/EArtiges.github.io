/* Fig 2, a floors chart: A, daily trips over the six test weeks, observed and predicted by the shares
   forecast (B), the regressor (R0) and the hybrid (H); B, the day's rain between 07:00 and 21:00. */
cfCharts.load('f2_daily.json').then(function (d) {
  var labels = d.dates.map(function (s) { var t = new Date(s); return t.getDate() + '/' + (t.getMonth() + 1); });
  var NAMES = { B: 'B. Last week × shares', R0: 'R0. Regressor', H: 'H. Last week × regressor' };

  cfCharts.chart('f2', function () {
    var F = cfCharts.floors('f2', { heights: [3, 1], right: 16 });
    var col = { B: cfCharts.c('orange'), R0: cfCharts.c('magenta'), H: cfCharts.c('accent') };
    var line = function (k) {
      return { name: NAMES[k], type: 'line', xAxisIndex: 0, yAxisIndex: 0, data: d.predicted[k], showSymbol: false,
               lineStyle: { width: k === 'H' ? 2.5 : 1.6, color: col[k], type: k === 'R0' ? 'dashed' : 'solid' },
               itemStyle: { color: col[k] } };
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
      xAxis: F.xAxis(cfCharts.axis('Day (six test weeks, Mondays labelled)', { type: 'category', data: labels,
        axisLabel: { color: cfCharts.c('text-secondary'), interval: function (i) { return i % 7 === 0; } },
        axisTick: { interval: function (i) { return i % 7 === 0; } },
        splitLine: { show: true, interval: function (i) { return i % 7 === 0; }, lineStyle: { color: cfCharts.c('rule') } } })),
      yAxis: [cfCharts.axis('Trips per day', { gridIndex: 0, nameGap: 50, min: 0 }),
              cfCharts.axis('Rain (mm)', { gridIndex: 1, nameGap: 50, min: 0, splitNumber: 2 })],
      series: [
        { name: 'Observed', type: 'line', xAxisIndex: 0, yAxisIndex: 0, data: d.actual, symbol: 'circle', symbolSize: 5,
          lineStyle: { width: 2, color: cfCharts.c('ink') }, itemStyle: { color: cfCharts.c('ink') } },
        line('B'), line('R0'), line('H'),
        { name: 'Rain', type: 'bar', xAxisIndex: 1, yAxisIndex: 1, data: d.rain, barWidth: '60%',
          itemStyle: { color: cfCharts.c('blue') } },
      ],
    });
  });
});
