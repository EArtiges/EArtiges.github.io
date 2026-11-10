/* Fig 3: share of the regressor's gain by feature family, without (R0) and with (R1) the habit prior.
   Families sorted by R1's share, so the habit prior sits at the top when it is present. */
cfCharts.load('f3_importance.json').then(function (d) {
  var model = 'R1';
  var NAMES = { R0: 'Without habits (R0)', R1: 'With the habit prior (R1)' };
  var order = d.groups.slice().sort(function (a, b) { return (d.models.R1[a] || 0) - (d.models.R1[b] || 0); });

  var fig = cfCharts.chart('f3', function () {
    var vals = order.map(function (g) { return +(100 * (d.models[model][g] || 0)).toFixed(1); });
    return Object.assign(cfCharts.base(), {
      grid: { left: 190, right: 40, top: 16, bottom: 40 },
      tooltip: cfCharts.tooltip({ trigger: 'item', formatter: function (p) {
        return '<b>' + p.name + '</b><br>' + NAMES[model] + ': ' + p.value + '% of the gain';
      } }),
      xAxis: cfCharts.axis('Share of the regressor’s gain (%)', { min: 0 }),
      yAxis: cfCharts.axis('', { type: 'category', data: order, splitLine: { show: false },
                                 axisLabel: { color: cfCharts.c('text-secondary') } }),
      series: [{ id: 'gain', type: 'bar', data: vals.map(function (v, i) {
        return { value: v, itemStyle: { color: order[i] === 'Habit prior' ? cfCharts.c('accent') : cfCharts.c('muted') } };
      }), barWidth: '60%', label: { show: true, position: 'right', color: cfCharts.c('text-secondary'), fontSize: 11,
                                    formatter: function (p) { return p.value ? p.value + '%' : ''; } } }],
    });
  });
  cfCharts.buttons('f3-controls', [NAMES.R0, NAMES.R1], function (v) {
    model = v === NAMES.R0 ? 'R0' : 'R1'; fig.update();
  }, NAMES.R1);
});
