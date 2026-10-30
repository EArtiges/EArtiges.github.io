/* Map 1: departures or arrivals per cell, average trips per hour, for one hour of a weekday or weekend day. */
Promise.all([ehMap.ready, cfCharts.load('m1_city.json')]).then(function (res) {
  var d = res[1];
  var mode = 'Departures', split = 'Weekday', hour = 8;
  // One colour scale per mode, shared by every hour and both day types, so the slider shows real change.
  var maxOf = {};
  ['departures', 'arrivals'].forEach(function (k) {
    var all = [];
    ['Weekday', 'Weekend'].forEach(function (s) { d[k][s].forEach(function (row) { all = all.concat(row); }); });
    all.sort(function (a, b) { return a - b; });
    maxOf[k] = Math.ceil(all[Math.floor(all.length * 0.995)]);   // a few downtown peaks saturate
  });
  var values = function () {
    var k = mode.toLowerCase();
    return d[k][split].map(function (row) { return row[hour]; });
  };

  var fig = ehMap.sized('m1', function (W) {
    return { height: W, geo: ehMap.square(W, W, 0) };
  }, function (layout) { return cfCharts.chart('m1', function () {
    var k = mode.toLowerCase(), L = layout();
    return Object.assign(cfCharts.base(), {
      tooltip: cfCharts.tooltip({ trigger: 'item', formatter: function (p) {
        return '<b>' + p.value[1].toFixed(1) + '</b> ' + k + ' per hour<br>' + split.toLowerCase() + 's, ' +
               ehMap.hour(hour) + '–' + ehMap.hour((hour + 1) % 24);
      } }),
      visualMap: ehMap.legend(0, maxOf[k], ehMap.seq(), ['≥ ' + maxOf[k] + ' trips/hour', '0'],
                              { seriesId: 'cells', dimension: 1 }),
      geo: [ehMap.geo(L.geo)],
      series: ehMap.base(0).concat([ehMap.hexes('cells', 0, values(), { gap: ehMap.gap(L.geo.height) })]),
    });
  }); });

  cfCharts.buttons('m1-controls', ['Departures', 'Arrivals'], function (v) { mode = v; fig.update(); }, mode);
  cfCharts.buttons('m1-controls', ['Weekday', 'Weekend'], function (v) { split = v; fig.update(); }, split);
  var input = ehMap.slider('m1-controls', 'Hour', 0, 23, hour, ehMap.hour, function (v) { hour = v; fig.update(); });

  // Fig 1 can drive the slider: clicking an hour there shows that hour here.
  window.addEventListener('eh-hour', function (e) {
    hour = e.detail; input.value = hour; input.refresh(); fig.update();
  });
});
