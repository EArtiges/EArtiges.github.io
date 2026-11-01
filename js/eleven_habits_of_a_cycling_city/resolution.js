/* Fig 2: what more resolution buys, on two floors sharing the resolution axis (cfCharts.floors).
   A: share of trips misplaced on seven held-out weeks (fit on the odd ISO weeks, scored on the even
      ones), under the resolution rule of decision 0016 (j = 1: below one expected trip, the model
      only claims "at most one"); against the ideal model (the true rates, given chance) and the raw
      counts of the odd weeks (history, the same at every resolution). The shaded gap is what a better
      model could still win.
   B: habits kept (bars) and the smallest kept habit's share of trips (line, linear scale); summer fits. */
cfCharts.load('f2_resolution.json').then(function (d) {
  var labels = d.curve.map(function (c) { return c.rank.join('·'); });
  var chosen = d.chosen.join('·');
  var habits = d.curve.map(function (c) { return c.n_habits; });
  var smallest = d.curve.map(function (c) { return +(c.smallest * 100).toFixed(1); });
  var pct = function (rows, key) { return rows.map(function (c) { return +(c[key] * 100).toFixed(1); }); };

  cfCharts.chart('f2', function () {
    var held = d.split_half.curve;
    var model = pct(held, 'j1'), floor = pct(held, 'ideal_j1');
    var history = labels.map(function () { return +(d.split_half.history_j1 * 100).toFixed(1); });
    var F = cfCharts.floors('f2', { heights: [3, 2] });
    var series = [
      // Floor A
      { id: 'model', name: 'Model', type: 'line', xAxisIndex: 0, yAxisIndex: 0, data: model, symbol: 'circle', symbolSize: 7,
        lineStyle: { width: 2.5, color: cfCharts.c('accent') }, itemStyle: { color: cfCharts.c('accent') },
        markLine: { silent: true, symbol: 'none', data: [{ xAxis: chosen }],
                    label: { formatter: 'eleven habits', color: cfCharts.c('text-secondary') },
                    lineStyle: { color: cfCharts.c('muted'), type: 'dotted' } } },
      { id: 'floor', name: 'Ideal model', type: 'line', xAxisIndex: 0, yAxisIndex: 0, data: floor, symbol: 'none',
        lineStyle: { width: 2, color: cfCharts.c('muted'), type: 'dashed' }, itemStyle: { color: cfCharts.c('muted') } },
      { id: 'history', name: 'Past weeks', type: 'line', xAxisIndex: 0, yAxisIndex: 0, data: history, symbol: 'none',
        lineStyle: { width: 2, color: cfCharts.c('orange') }, itemStyle: { color: cfCharts.c('orange') } },
      cfCharts.band('gap', labels, floor, model, cfCharts.rgba('accent', 0.12)),
      // Floor B
      { id: 'habits', name: 'Habits kept', type: 'bar', xAxisIndex: 1, yAxisIndex: 1, data: habits, barWidth: '45%',
        itemStyle: { color: cfCharts.rgba('muted', 0.3) },
        label: { show: true, position: 'top', distance: 3, color: cfCharts.c('text-secondary'), fontSize: 11 },
        markLine: { silent: true, symbol: 'none', data: [{ xAxis: chosen }], label: { show: false },
                    lineStyle: { color: cfCharts.c('muted'), type: 'dotted' } } },
      { id: 'smallest', name: 'Smallest habit', type: 'line', xAxisIndex: 1, yAxisIndex: 2, data: smallest,
        symbol: 'circle', symbolSize: 6, lineStyle: { width: 2, color: cfCharts.c('magenta') },
        itemStyle: { color: cfCharts.c('magenta') } },
    ];
    var right = function (name, extra) { return cfCharts.axis(name, Object.assign({ position: 'right', nameGap: 38, splitLine: { show: false } }, extra)); };
    return Object.assign(cfCharts.base(), {
      grid: F.grid, title: F.title, axisPointer: F.axisPointer,
      legend: { top: 0, right: 8, textStyle: { color: cfCharts.c('text-secondary') } },
      tooltip: cfCharts.tooltip({ trigger: 'axis', formatter: function (ps) {
        var i = labels.indexOf(ps[0].axisValue);
        return '<b>Resolution ' + ps[0].axisValue + '</b><br>' +
          'model: ' + model[i] + '% of trips misplaced<br>' +
          'ideal model: ' + floor[i] + '% · gap: ' + (model[i] - floor[i]).toFixed(1) + ' pts<br>' +
          'past weeks: ' + history[i] + '%<br>' +
          habits[i] + ' habits kept · smallest: ' + smallest[i] + '% of trips';
      } }),
      xAxis: F.xAxis(cfCharts.axis('Resolution (origin groups · destination groups · rhythms)',
                                   { type: 'category', data: labels, splitLine: { show: false } })),
      yAxis: [
        cfCharts.axis('Trips misplaced (%)', { gridIndex: 0, nameGap: 42, min: 0, max: 40, interval: 10 }),
        cfCharts.axis('Habits kept', { gridIndex: 1, nameGap: 42, min: 0, max: 30, interval: 10 }),
        right('Smallest habit (% of trips)', { gridIndex: 1, min: 0, max: 40, interval: 10,
                                               axisLabel: { color: cfCharts.c('text-secondary'), formatter: function (v) { return v + '%'; } } }),
      ],
      series: series,
    });
  });
});
