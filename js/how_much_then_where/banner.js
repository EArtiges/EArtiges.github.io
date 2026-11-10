/* Banner (above the first paragraph, not a numbered figure): weekly summer trips in Oslo, one line per
   year 2019–2025, ISO weeks 23–34; 2023, the year the post studies, in the accent colour. No text,
   no axes, nothing to hover. */
cfCharts.load('banner_weeks.json').then(function (d) {
  var el = document.getElementById('hw-header');
  var size = function () { el.style.height = Math.round(el.clientWidth * 0.32) + 'px'; };
  size();
  var years = Object.keys(d.years);
  var fig = cfCharts.chart('hw-header', function () {
    return Object.assign(cfCharts.base(), {
      animation: false,
      grid: { left: 4, right: 4, top: 8, bottom: 8 },
      xAxis: { type: 'category', data: d.weeks, show: false, boundaryGap: false },
      yAxis: { type: 'value', show: false, min: 0 },
      series: years.map(function (y) {
        var main = y === '2023';
        return { type: 'line', silent: true, showSymbol: false, smooth: 0.3, data: d.years[y], z: main ? 3 : 2,
                 lineStyle: { width: main ? 3 : 1.5, color: main ? cfCharts.c('accent') : cfCharts.rgba('muted', 0.55) } };
      }),
    });
  });
  window.addEventListener('resize', function () { size(); fig.chart.resize(); });
});
