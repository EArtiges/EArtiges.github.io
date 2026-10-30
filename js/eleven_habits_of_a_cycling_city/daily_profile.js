/* Fig 1: city-wide departures per hour on an average weekday and weekend day. Click an hour to show it on Map 1. */
cfCharts.load('f1_profile.json').then(function (d) {
  var hours = d.Weekday.map(function (_, h) { return h; });
  var line = function (name, dashed) {
    return { name: name, type: 'line', smooth: 0.2, symbol: 'circle', symbolSize: 5, showSymbol: false,
             data: d[name], lineStyle: { width: 2.5, type: dashed ? 'dashed' : 'solid', color: cfCharts.c('accent') },
             itemStyle: { color: cfCharts.c('accent') } };
  };
  var fig = cfCharts.chart('f1', function () {
    return Object.assign(cfCharts.base(), {
      grid: { left: 64, right: 16, top: 36, bottom: 48 },
      legend: { top: 0, right: 8, textStyle: { color: cfCharts.c('text-secondary') }, data: ['Weekday', 'Weekend'] },
      tooltip: cfCharts.tooltip({ trigger: 'axis', formatter: function (ps) {
        var h = +ps[0].axisValue;
        return '<b>' + ehMap.hour(h) + '–' + ehMap.hour((h + 1) % 24) + '</b><br>' +
          'Weekday: ' + Math.round(d.Weekday[h]) + ' departures/hour<br>' +
          'Weekend: ' + Math.round(d.Weekend[h]) + ' departures/hour';
      } }),
      xAxis: cfCharts.axis('Hour of the day', { type: 'category', data: hours, boundaryGap: false,
        axisLabel: { color: cfCharts.c('text-secondary'), interval: 2, formatter: function (h) { return ehMap.hour(+h); } },
        splitLine: { show: false } }),
      yAxis: cfCharts.axis('Departures per hour', { nameGap: 46 }),
      series: [line('Weekday', false), line('Weekend', true)],
    });
  });
  fig.chart.getZr().on('click', function (e) {
    var p = [e.offsetX, e.offsetY];
    if (!fig.chart.containPixel('grid', p)) return;
    var h = Math.round(fig.chart.convertFromPixel({ xAxisIndex: 0 }, p)[0]);
    window.dispatchEvent(new CustomEvent('eh-hour', { detail: Math.max(0, Math.min(23, h)) }));
  });
});
