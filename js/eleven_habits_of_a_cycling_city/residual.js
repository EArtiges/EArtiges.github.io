/* Fig 3: a week the model never saw, against the model. A wide chart (cfCharts.wide): the map (each
   cell's departures over the week against the model, in %) and the time plot (city-wide trips per hour of
   the week, observed vs model, residual as bars). */
Promise.all([ehMap.ready, cfCharts.load('f3_residual.json')]).then(function (res) {
  var d = res[1], CAP = 60;
  var bins = d.observed.map(function (_, b) { return b; });
  var resid = d.observed.map(function (v, b) { return v - d.model[b]; });
  var fmt = function (b) { return ehMap.DAYS[Math.floor(b / 24)] + ' ' + ehMap.hour(b % 24); };
  var frames = cfCharts.wide('f3', { split: 0.25 });

  // The map shows the error two ways: relative (% of the model) flags quiet cells that are badly off,
  // absolute (trips) flags where most trips are missing. Both scales saturate at their caps.
  var view = 'Relative error', CAP_TRIPS = d.abs_cap || 300;
  var sign = function (v) { return (v >= 0 ? '+' : '−') + Math.abs(v); };

  var map = cfCharts.chart(frames.left, function () {
    var o = d.departures.observed, m = d.departures.model, pctView = view === 'Relative error';
    var cap = pctView ? CAP : CAP_TRIPS;
    var vals = o.map(function (v, i) {
      var x = pctView ? (m[i] > 0 ? 100 * (v - m[i]) / m[i] : 0) : v - m[i];
      return Math.max(-cap, Math.min(cap, x));
    });
    return Object.assign(cfCharts.base(), {
      tooltip: cfCharts.tooltip({ trigger: 'item', formatter: function (p) {
        var i = p.value[0];
        return '<b>' + sign(Math.round(o[i] - m[i])) + ' departures</b> (' + sign(Math.round(100 * (o[i] - m[i]) / m[i])) + '%) vs the model<br>' +
               'observed ' + Math.round(o[i]) + ', model ' + Math.round(m[i]) + ' over the week';
      } }),
      // Horizontal, in the bottom-left corner: over the fjord, clear of every hex.
      visualMap: ehMap.legend(-cap, cap, ehMap.div(),
        pctView ? ['+' + CAP + '%', '−' + CAP + '%'] : ['+' + CAP_TRIPS + ' trips', '−' + CAP_TRIPS],
        { seriesId: 'cells', dimension: 1, orient: 'horizontal', itemHeight: 90, itemWidth: 10,
          left: 6, right: null, top: null, bottom: 6 }),
      geo: [ehMap.geo({ left: 0, right: 0, top: 0, bottom: 0 })],
      series: ehMap.base(0).concat([ehMap.hexes('cells', 0, vals,
        { gap: ehMap.gap(document.getElementById(frames.left).clientHeight) })]),
    });
  });
  cfCharts.buttons('f3-controls', ['Relative error', 'Absolute error'], function (v) { view = v; map.update(); }, view);

  var plot = cfCharts.chart(frames.right, function () {
    // A narrow plot (phone) has no room for title and legend on one row: the legend gets its own.
    var narrow = document.getElementById(frames.right).clientWidth < 600;
    return Object.assign(cfCharts.base(), {
      title: { left: 0, top: 0, text: 'Week of ' + d.dates[0] + ' to ' + d.dates[1],
               textStyle: { color: cfCharts.c('ink'), fontSize: 14 } },
      legend: { top: narrow ? 24 : 0, right: 8, data: ['Observed', 'Model', 'Residual'], textStyle: { color: cfCharts.c('text-secondary') } },
      tooltip: cfCharts.tooltip({ trigger: 'item', formatter: function (p) {
        var b = p.dataIndex;
        return '<b>' + fmt(b) + '</b><br>observed ' + Math.round(d.observed[b]) + ' trips<br>model ' +
               Math.round(d.model[b]) + ' trips<br>residual ' + (resid[b] >= 0 ? '+' : '') + Math.round(resid[b]);
      } }),
      grid: { left: 56, right: 12, top: narrow ? 62 : 40, bottom: 28 },
      xAxis: cfCharts.axis('', { type: 'category', data: bins, boundaryGap: false,
        axisLabel: { color: cfCharts.c('text-secondary'), interval: 23,
                     formatter: function (b) { return ehMap.DAYS[Math.floor(+b / 24)]; } },
        axisTick: { interval: 23 }, splitLine: { show: true, interval: 23, lineStyle: { color: cfCharts.c('rule') } } }),
      yAxis: cfCharts.axis('Trips per hour', { nameGap: 40, splitNumber: 3 }),
      series: [
        { id: 'res', name: 'Residual', type: 'bar', data: resid.map(function (v) {
            return { value: v, itemStyle: { color: v >= 0 ? cfCharts.c('orange') : cfCharts.c('blue') } };
          }), barWidth: '90%', itemStyle: { color: cfCharts.c('orange') } },
        { id: 'obs', name: 'Observed', type: 'line', data: d.observed, showSymbol: false,
          lineStyle: { width: 1.6, color: cfCharts.c('ink') }, itemStyle: { color: cfCharts.c('ink') } },
        { id: 'mod', name: 'Model', type: 'line', data: d.model, showSymbol: false,
          lineStyle: { width: 2, color: cfCharts.c('accent'), type: 'dashed' }, itemStyle: { color: cfCharts.c('accent') } },
      ],
    });
  });

  // A width change re-lays out with a merge, not a rebuild (see ehMap.sized for why).
  frames.onResize(function () { map.chart.resize(); plot.chart.resize(); map.update(); plot.update(); });
});
