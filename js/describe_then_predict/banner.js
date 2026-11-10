/* Banner (above the first paragraph, not a numbered figure): daily trips over the six test weeks,
   observed (ink) and forecast by the hybrid (accent). No text, no axes, nothing to hover. */
cfCharts.load('banner_daily.json').then(function (d) {
  var el = document.getElementById('dp-header');
  var size = function () { el.style.height = Math.round(el.clientWidth * 0.3) + 'px'; };
  size();
  var x = d.actual.map(function (_, i) { return i; });
  var fig = cfCharts.chart('dp-header', function () {
    var line = function (data, color, width) {
      return { type: 'line', silent: true, showSymbol: false, smooth: 0.3, data: data,
               lineStyle: { width: width, color: color } };
    };
    return Object.assign(cfCharts.base(), {
      animation: false,
      grid: { left: 4, right: 4, top: 8, bottom: 8 },
      xAxis: { type: 'category', data: x, show: false, boundaryGap: false },
      yAxis: { type: 'value', show: false, min: 0 },
      series: [line(d.actual, cfCharts.rgba('ink', 0.55), 1.8), line(d.hybrid, cfCharts.c('accent'), 3)],
    });
  });
  window.addEventListener('resize', function () { size(); fig.chart.resize(); });
});
