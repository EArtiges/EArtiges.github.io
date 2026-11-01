/* Banner (above the first paragraph, not a numbered figure): eight of the eleven habits as small
   maps, 2 rows of 4, no text, no legend, nothing to click. Each panel is a habit's footprint
   (departures and arrivals together) in the post's tile style, over water and parks only. */
Promise.all([ehMap.ready, cfCharts.load('m2_habits.json')]).then(function (res) {
  var habits = res[1].habits;
  // The eight with the most distinct footprints; 7, 8 and 11 repeat 4's and the centre's.
  var PICK = [4, 1, 10, 9, 2, 3, 5, 6];
  var shown = PICK.map(function (r) { return habits[r - 1]; });
  var COLS = 4, PAD = 6;

  var fig = ehMap.sized('eh-header', function (W) {
    var side = Math.floor((W - PAD * (COLS - 1)) / COLS), rows = Math.ceil(shown.length / COLS);
    return { height: rows * side + (rows - 1) * PAD, side: side };
  }, function (layout) { return cfCharts.chart('eh-header', function () {
    var L = layout(), gap = ehMap.gap(L.side);
    return Object.assign(cfCharts.base(), {
      animation: false,
      geo: shown.map(function (h, i) {
        return ehMap.geo({ left: (i % COLS) * (L.side + PAD), top: Math.floor(i / COLS) * (L.side + PAD),
                           width: L.side, height: L.side, roam: false });
      }),
      series: shown.map(function (h, i) {
        var foot = h.departures.map(function (v, c) { return v + h.arrivals[c]; });
        var top = Math.max.apply(null, foot);
        return ehMap.hexes('b' + i, i, foot, { gap: gap, series: { silent: true },
          colorOf: function (v) { return ehMap.seqColor(Math.sqrt(v / top)); } });
      }),
    });
  }); });
});
