/* Map 2: one habit at a time. A wide chart (cfCharts.wide): where the habit departs from or arrives
   at (square map) beside when it rides (weekday/weekend curves over the day). */
Promise.all([ehMap.ready, cfCharts.load('m2_habits.json')]).then(function (res) {
  var d = res[1], k = 0, mode = 'Departures';
  var hours = d.habits[0].Weekday.map(function (_, h) { return h; });
  var frames = cfCharts.wide('m2', { split: 0.25 });

  var map = cfCharts.chart(frames.left, function () {
    var h = d.habits[k], key = mode.toLowerCase();
    var pct = h[key].map(function (v) { return v * 100; });
    var max = Math.max.apply(null, pct);
    return Object.assign(cfCharts.base(), {
      tooltip: cfCharts.tooltip({ trigger: 'item', formatter: function (p) {
        return '<b>' + p.value[1].toFixed(1) + '%</b> of habit ' + h.rank + "'s " + key;
      } }),
      // Horizontal, in the bottom-left corner: over the fjord, clear of every hex.
      visualMap: ehMap.legend(0, max, ehMap.seq(), [max.toFixed(0) + '% of its ' + key, '0%'],
        { seriesId: 'cells', dimension: 1, orient: 'horizontal', itemHeight: 90, itemWidth: 10,
          left: 6, right: null, top: null, bottom: 6 }),
      geo: [ehMap.geo({ left: 0, right: 0, top: 0, bottom: 0 })],
      series: ehMap.base(0).concat([ehMap.hexes('cells', 0, pct,
        { gap: ehMap.gap(document.getElementById(frames.left).clientHeight) })]),
    });
  });

  var plot = cfCharts.chart(frames.right, function () {
    var h = d.habits[k];
    // A narrow plot (phone) has no room for title and legend on one row: the legend gets its own.
    var narrow = document.getElementById(frames.right).clientWidth < 600;
    var line = function (name, dashed) {
      return { id: name, name: name, type: 'line', smooth: 0.2, showSymbol: false, data: h[name],
               lineStyle: { width: 2.5, type: dashed ? 'dashed' : 'solid', color: cfCharts.c('accent') },
               itemStyle: { color: cfCharts.c('accent') } };
    };
    return Object.assign(cfCharts.base(), {
      title: { left: 0, top: 0, text: 'Habit ' + h.rank + ' · ' + (h.share * 100).toFixed(1) + '% of trips',
               subtext: 'busiest ' + h.peak.day + ' ' + ehMap.hour(h.peak.hour) + ' · ' +
                        Math.round(h.weekday_share * 100) + '% of its trips on weekdays',
               textStyle: { color: cfCharts.c('ink'), fontSize: 15 }, subtextStyle: { color: cfCharts.c('text-secondary') } },
      legend: { top: narrow ? 44 : 0, right: 8, data: ['Weekday', 'Weekend'], textStyle: { color: cfCharts.c('text-secondary') } },
      tooltip: cfCharts.tooltip({ trigger: 'item', formatter: function (p) {
        return p.seriesName + ', ' + ehMap.hour(p.dataIndex) + ': <b>' + p.value.toFixed(1) + '</b> trips/hour';
      } }),
      grid: { left: 56, right: 12, top: narrow ? 74 : 56, bottom: 28 },
      xAxis: cfCharts.axis('', { type: 'category', data: hours, boundaryGap: false,
        axisLabel: { color: cfCharts.c('text-secondary'), interval: 2, formatter: function (x) { return ehMap.hour(+x); } },
        splitLine: { show: false } }),
      yAxis: cfCharts.axis('Trips per hour', { nameGap: 40, splitNumber: 3 }),
      series: [line('Weekday', false), line('Weekend', true)],
    });
  });

  var both = function () { map.update(); plot.update(); };
  frames.onResize(function () { map.chart.resize(); plot.chart.resize(); both(); });

  var labels = d.habits.map(function (h) { return String(h.rank); });
  var lead = document.createElement('span');
  lead.textContent = 'Habit '; lead.style.marginRight = '4px';
  document.getElementById('m2-controls').appendChild(lead);
  cfCharts.buttons('m2-controls', labels, function (v) { k = +v - 1; both(); }, '1');
  // Departures/Arrivals changes only the map: the curves count the habit's trips either way.
  cfCharts.buttons('m2-controls', ['Departures', 'Arrivals'], function (v) { mode = v; map.update(); }, mode);
});
