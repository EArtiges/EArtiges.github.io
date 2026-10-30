/* Fig 2: share of trips the model misplaces as the resolution grows.
   "Fitted summer": the summer fit against its noise floor — what even the true rates would misplace,
   because a slot expecting 0.3 trips holds 0 or 1.
   "Predicting the other half": fitted on odd weeks, scored on even weeks, against the odd weeks'
   raw counts — the summer's disagreement with itself, no model involved. */
cfCharts.load('f2_resolution.json').then(function (d) {
  var labels = d.curve.map(function (c) { return c.rank.join('·'); });
  var chosen = d.chosen.join('·');
  var view = 'Fitted summer';
  var habits = d.curve.map(function (c) { return c.n_habits; });
  var pct = function (rows, key) { return rows.map(function (c) { return +(c[key] * 100).toFixed(1); }); };

  var fig = cfCharts.chart('f2', function () {
    var fitted = view === 'Fitted summer', rows = fitted ? d.curve : d.split_half.curve;
    var model = pct(rows, 'misplaced'), floor = pct(rows, 'floor');
    var raw = fitted ? [] : labels.map(function () { return +(d.split_half.raw_counts * 100).toFixed(1); });
    var series = [
      { id: 'model', name: 'Model', type: 'line', data: model, symbol: 'circle', symbolSize: 7,
        lineStyle: { width: 2.5, color: cfCharts.c('accent') }, itemStyle: { color: cfCharts.c('accent') },
        markLine: { silent: true, symbol: 'none', data: [{ xAxis: chosen }],
                    label: { formatter: 'eleven habits', color: cfCharts.c('text-secondary') },
                    lineStyle: { color: cfCharts.c('muted'), type: 'dotted' } } },
      { id: 'floor', name: 'Noise floor', type: 'line', data: floor, symbol: 'none',
        lineStyle: { width: 2, color: cfCharts.c('muted'), type: 'dashed' }, itemStyle: { color: cfCharts.c('muted') } },
      cfCharts.band('gap', labels, floor, model, cfCharts.rgba('accent', 0.12)),
    ];
    if (!fitted) series.push({ id: 'raw', name: 'Raw counts of the odd weeks', type: 'line', data: raw, symbol: 'none',
      lineStyle: { width: 2, color: cfCharts.c('orange') }, itemStyle: { color: cfCharts.c('orange') } });
    return Object.assign(cfCharts.base(), {
      grid: { left: 60, right: 16, top: 48, bottom: 52 },
      legend: { top: 0, right: 8, textStyle: { color: cfCharts.c('text-secondary') } },
      tooltip: cfCharts.tooltip({ trigger: 'axis', formatter: function (ps) {
        var i = labels.indexOf(ps[0].axisValue);
        return '<b>Resolution ' + ps[0].axisValue + '</b>: ' + habits[i] + ' habits<br>' +
          'model: ' + model[i] + '% of trips misplaced<br>' +
          (fitted ? '' : 'raw counts of the odd weeks: ' + raw[i] + '%<br>') +
          'noise floor: ' + floor[i] + '%';
      } }),
      xAxis: cfCharts.axis('Resolution (origin groups · destination groups · rhythms)',
                           { type: 'category', data: labels, splitLine: { show: false } }),
      yAxis: cfCharts.axis('Trips misplaced (%)', { nameGap: 42, min: 0, max: 60 }),
      series: series,
    });
  });
  if (d.split_half) cfCharts.buttons('f2-controls', ['Fitted summer', 'Predicting the other half'],
                                     function (v) { view = v; fig.update(); }, view);
});
