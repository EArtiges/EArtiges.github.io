/* Map 4: cells grouped by their AlphaEarth embeddings alone (k-means). Click a cluster in the legend
   to fade its cells (opacity 0.1) and again to bring them back. Sets the number of clusters for
   Fig 11 too (event 'sf-k'). */
// Element id: 'm4' in the long draft; a page can rename it with window.sfIds = { m4: '...' } before loading.
var ID_M4 = (window.sfIds && window.sfIds.m4) || 'm4';
Promise.all([ehMap.ready, cfCharts.load('m4_clusters.json')]).then(function (res) {
  var d = res[1], k = '4', off = {};   // off[c]: cluster c faded
  var fig = ehMap.sized(ID_M4, function (W) { return { height: W, geo: ehMap.square(W, W, 0) }; },
    function (layout) { return cfCharts.chart(ID_M4, function () {
      var L = layout(), lab = d.labels[k];
      var name = function (c) { return sfMap.LETTERS[c] + ' · ' + mean[c].n + ' cells'; };
      var mean = [];
      for (var c = 0; c < +k; c++) {
        var xs = d.departures.filter(function (_, i) { return lab[i] === c; });
        mean.push({ n: xs.length, dep: xs.reduce(function (a, b) { return a + b; }, 0) / xs.length });
      }
      return Object.assign(cfCharts.base(), {
        tooltip: cfCharts.tooltip({ trigger: 'item', formatter: function (p) {
          var i = p.value[0], c = lab[i];
          return 'Cell <b>' + d.ids[i] + '</b> · cluster <b>' + sfMap.LETTERS[c] + '</b><br>' +
                 d.departures[i].toFixed(1) + ' departures/day (cluster average ' + mean[c].dep.toFixed(1) +
                 ' over ' + mean[c].n + ' cells)';
        } }),
        legend: { top: 8, left: 8, orient: 'vertical', backgroundColor: cfCharts.rgba('bg', 0.85), padding: 8,
                  textStyle: { color: cfCharts.c('ink') }, inactiveColor: cfCharts.c('muted'),
                  selected: mean.reduce(function (o, m, c) { o[name(c)] = !off[c]; return o; }, {}),
                  data: mean.map(function (m, c) { return { name: name(c), itemStyle: { color: sfMap.clusterColor(c) } }; }) },
        geo: [ehMap.geo(Object.assign({ roam: false }, L.geo))],   // no zoom or pan in this post
        series: ehMap.base(0).concat([ehMap.hexes('cells', 0, lab, {
          gap: ehMap.gap(L.geo.height),
          colorOf: function (c) { return echarts.color.modifyAlpha(sfMap.clusterColor(c), off[c] ? 0.1 : 0.85); } })],
          // legend entries need series with those names; empty scatters carry them
          mean.map(function (m, c) {
            return { id: 'leg' + c, name: name(c), type: 'scatter', data: [],
                     coordinateSystem: 'geo', geoIndex: 0, silent: true,
                     itemStyle: { color: sfMap.clusterColor(c) } };
          })),
      });
    }); });
  fig.chart.on('legendselectchanged', function (e) {
    var c = sfMap.LETTERS.indexOf(e.name.charAt(0));
    off[c] = !e.selected[e.name]; fig.update();
  });
  cfCharts.buttons(ID_M4 + '-controls', ['3', '4', '5', '6'].map(function (x) { return x + ' clusters'; }), function (v) {
    k = v.split(' ')[0]; off = {}; fig.update();
    window.dispatchEvent(new CustomEvent('sf-k', { detail: k }));
  }, k + ' clusters');
});
