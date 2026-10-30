/* Map 3: every habit side by side, plus all trips: departures over the 168 hours of the week.
   Play runs the week five times. */
Promise.all([ehMap.ready, cfCharts.load('m3_pulse.json')]).then(function (res) {
  var d = res[1], panels = d.panels, t = 8;   // Monday 08:00
  // Each panel ships as 0–255 codes of its own maximum (a small file); decode to trips per hour.
  panels.forEach(function (p) {
    p.departures = p.codes.map(function (row) { return row.map(function (c) { return c * p.max / 255; }); });
  });
  var CYCLES = 5, STEP_MS = 110, timer = null, stepsLeft = 0;
  var fmt = function (b) { return ehMap.DAYS[Math.floor(b / 24)] + ' ' + ehMap.hour(b % 24); };

  // Each panel on its own scale (its busiest cell-hour over the week), or small habits would vanish.
  var maxOf = panels.map(function (p) {
    return Math.max.apply(null, p.departures.map(function (row) { return Math.max.apply(null, row); }));
  });
  // Tile grout scales with the panel height; set by each render, reused by every animation tick.
  var tileGap = 1;
  var cellSeries = function (i) {
    var m = maxOf[i];
    return ehMap.hexes('h' + i, i, panels[i].departures[t], { gap: tileGap,
      colorOf: function (v) { return ehMap.seqColor(Math.sqrt(v / m)); } });
  };

  // Square panels: the column width sets the side, and the side sets the figure's height.
  var grid = function (W) {
    var cols = W >= 640 ? 4 : 3, rows = Math.ceil(panels.length / cols), cw = W / cols;
    var PAD = 8, TITLE = 20, side = Math.floor(cw - PAD), rowH = TITLE + side + PAD;
    return { height: rows * rowH, panels: panels.map(function (p, i) {
      var c = i % cols, r = Math.floor(i / cols);
      return Object.assign(ehMap.square(cw, side, r * rowH + TITLE), {
        left: Math.round(c * cw + PAD / 2), title: { left: Math.round(c * cw + cw / 2), top: r * rowH + 2 } });
    }) };
  };

  var fig = ehMap.sized('m3', grid, function (layout) { return cfCharts.chart('m3', function () {
    var L = layout().panels;
    tileGap = ehMap.gap(L[0].height);
    return Object.assign(cfCharts.base(), {
      title: panels.map(function (p, i) {
        return { text: p.label === 'All trips' ? 'All trips' : p.label + ' · ' + (p.share * 100).toFixed(0) + '%',
                 left: L[i].title.left, top: L[i].title.top, textAlign: 'center',
                 textStyle: { fontSize: 12, fontWeight: p.label === 'All trips' ? 700 : 500, color: cfCharts.c('ink') } };
      }),
      tooltip: cfCharts.tooltip({ trigger: 'item', formatter: function (p) {
        var i = +p.seriesId.slice(1);
        return panels[i].label + ', ' + fmt(t) + '<br><b>' + p.value[1].toFixed(2) + '</b> departures per hour';
      } }),
      geo: panels.map(function (p, i) {
        return ehMap.geo({ left: L[i].left, top: L[i].top, width: L[i].width, height: L[i].height,
                           roam: false });
      }),
      series: panels.map(function (p, i) { return cellSeries(i); }),
    });
  }); });

  var draw = function () {
    fig.chart.setOption({ series: panels.map(function (p, i) { return cellSeries(i); }) }, { lazyUpdate: true });
    input.value = t; input.refresh();
  };
  var stop = function () { clearInterval(timer); timer = null; play.textContent = '▶ Play the week'; play.setAttribute('aria-pressed', 'false'); };
  var play = document.createElement('button');
  play.className = 'p5-button'; play.textContent = '▶ Play the week'; play.setAttribute('aria-pressed', 'false');
  play.onclick = function () {
    if (timer) return stop();
    stepsLeft = CYCLES * 168;
    play.textContent = '❚❚ Pause'; play.setAttribute('aria-pressed', 'true');
    timer = setInterval(function () {
      t = (t + 1) % 168; draw();
      if (--stepsLeft <= 0) stop();
    }, STEP_MS);
  };
  document.getElementById('m3-controls').appendChild(play);
  var input = ehMap.slider('m3-controls', '', 0, 167, t, fmt, function (v) { stop(); t = v; draw(); });
});
