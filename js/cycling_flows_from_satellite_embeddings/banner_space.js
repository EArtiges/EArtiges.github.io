/* Banner of "Oslo from space" (above the first paragraph, not a numbered figure): the 70 cells in AlphaEarth
   false colour (the first three principal components of their 2025 embeddings as red, green and blue,
   m2_embeddings.json), over the basemap. No text, legend, tooltip or zoom. */
Promise.all([ehMap.ready, cfCharts.load('m2_embeddings.json')]).then(function (res) {
  var d = res[1], RATIO = 0.62;   // banner height / width; the square map is cropped top and bottom
  var byId = {};
  d.ids.forEach(function (id, i) { byId[id] = d.colors[i]; });
  ehMap.sized('os-header', function (W) {
    var H = Math.round(W * RATIO);
    return { height: H, geo: { left: 0, top: Math.round((H - W) / 2), width: W, height: W } };
  }, function (layout) { return cfCharts.chart('os-header', function () {
    var L = layout();
    var values = ehMap.data.cells.map(function (c) { return byId[c] ? 1 : null; });
    return Object.assign(cfCharts.base(), {
      animation: false,
      geo: [ehMap.geo(Object.assign({ roam: false, silent: true }, L.geo))],
      series: ehMap.base(0).concat([ehMap.hexes('cells', 0, values, { gap: ehMap.gap(L.geo.height),
        colorOf: function (v, i) { var c = byId[ehMap.data.cells[i]]; return c || 'rgba(0,0,0,0)'; },
        series: { silent: true } })]),
    });
  }); });
});
