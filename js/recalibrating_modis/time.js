/* F9: small multiples, one suburb per panel: WA canopy by survey year, with raw MODIS and GAM (legend toggles). */
cfCharts.load('f9_time.json').then(function (d) {
  var el = document.getElementById('f9');
  var layout = function () {
    var cols = el.clientWidth < 620 ? 2 : 4, rows = Math.ceil(d.panels.length / cols);
    el.style.height = (rows * 175 + 60) + 'px';
    return { cols: cols, rows: rows };
  };
  var ymax = Math.ceil(Math.max.apply(null, d.panels.map(function (p) {
    return Math.max.apply(null, p.wa.concat(p.raw, p.gam));
  })) / 10) * 10;
  var tag = { 'Largest measured gain': 'gain', 'Largest measured loss': 'loss' };

  var L = layout();
  var fig = cfCharts.chart('f9', function () {
    var grids = [], xs = [], ys = [], titles = [], series = [];
    var colW = 100 / L.cols, rowH = (100 - 60 / el.clientHeight * 100) / L.rows;
    d.panels.forEach(function (p, k) {
      var c = k % L.cols, r = Math.floor(k / L.cols), top = 60 / el.clientHeight * 100 + r * rowH;
      grids.push({ left: (c * colW + 4) + '%', width: (colW - 6) + '%', top: (top + rowH * 0.22) + '%', height: (rowH * 0.6) + '%' });
      titles.push({ text: p.name, subtext: tag[p.group] || 'stable', left: (c * colW + 4) + '%', top: (top + rowH * 0.02) + '%',
                    textStyle: { fontSize: 12, color: cfCharts.c('ink') }, subtextStyle: { fontSize: 10, color: cfCharts.c('muted') }, itemGap: 2 });
      xs.push({ gridIndex: k, type: 'category', data: d.years, boundaryGap: false, axisTick: { show: false },
                axisLabel: { color: cfCharts.c('text-secondary'), fontSize: 9, interval: 0, formatter: function (v) { return "'" + String(v).slice(2); } },
                axisLine: { lineStyle: { color: cfCharts.c('muted') } } });
      ys.push({ gridIndex: k, type: 'value', min: 0, max: ymax, splitNumber: 2,
                axisLabel: { color: cfCharts.c('text-secondary'), fontSize: 9 }, splitLine: { lineStyle: { color: cfCharts.c('rule') } } });
      [['WA canopy', p.wa, cfCharts.c('ink'), 'solid'], ['Raw MODIS', p.raw, cfCharts.c('orange'), 'dashed'], ['GAM estimate', p.gam, cfCharts.c('blue'), 'solid']]
        .forEach(function (s) {
          series.push({ name: s[0], type: 'line', xAxisIndex: k, yAxisIndex: k, data: s[1], symbolSize: 4,
                        itemStyle: { color: s[2] }, lineStyle: { color: s[2], type: s[3], width: s[0] === 'WA canopy' ? 2 : 1.5 } });
        });
    });
    return Object.assign(cfCharts.base(), {
      legend: { top: 4, left: 'center', textStyle: { color: cfCharts.c('ink') }, data: ['WA canopy', 'Raw MODIS', 'GAM estimate'] },
      tooltip: cfCharts.tooltip({ trigger: 'axis', valueFormatter: function (v) { return v.toFixed(1) + '%'; } }),
      title: titles, grid: grids, xAxis: xs, yAxis: ys, series: series,
    });
  });
  window.addEventListener('resize', function () { L = layout(); fig.chart.resize(); fig.redraw(); });
});
