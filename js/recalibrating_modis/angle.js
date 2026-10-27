/* F10: view angle or GAM error by suburb (toggle). F11: absolute error against view angle, GAM or raw MODIS. */
Promise.all([cfCharts.load('outlines.json'), cfCharts.load('f10_angle.json')]).then(function (res) {
  var geo = res[0], d = res[1];
  echarts.registerMap('rm-suburbs', geo);
  var signed = function (v) { return (v >= 0 ? '+' : '') + v.toFixed(1); };

  // F10
  var layer = 'angle', bySuburb = {};
  d.suburbs.forEach(function (s) { bySuburb[s.n] = s; });
  var labels = { angle: 'View angle', err: 'GAM error' };
  var f10 = cfCharts.chart('f10', function () {
    var angle = layer === 'angle';
    var data = geo.features.map(function (f) {
      var s = bySuburb[f.properties.name];
      return s ? { name: s.n, value: angle ? s.vza : s.err, vza: s.vza, err: s.err } : { name: f.properties.name, value: null,
        itemStyle: { areaColor: cfCharts.c('bg'), decal: { symbol: 'rect', symbolSize: 1, dashArrayX: [1, 0], dashArrayY: [2, 5],
                                                     rotation: -Math.PI / 4, color: cfCharts.rgba('muted', 0.7) } } };
    });
    return Object.assign(cfCharts.base(), {
      tooltip: cfCharts.tooltip({ trigger: 'item', formatter: function (p) {
        var s = p.data; if (!s || s.value === null) return '<b>' + p.name + '</b><br>not modelled (WA measured <80%)';
        return '<b>' + p.name + '</b><br>view angle ' + s.vza.toFixed(1) + '°<br>GAM error ' + signed(s.err) + ' pts';
      } }),
      visualMap: { type: 'continuous', right: 8, top: 8, itemHeight: 120, calculable: false, textStyle: { color: cfCharts.c('text-secondary') },
                   min: angle ? 15 : -8, max: angle ? 35 : 8,
                   text: angle ? ['35°+', '15°'] : ['+8 over', '−8 under'],
                   inRange: { color: angle ? [cfCharts.neutral(), cfCharts.c('accent')]
                                           : [cfCharts.c('blue'), cfCharts.neutral(), cfCharts.c('magenta')] } },
      series: [{ type: 'map', map: 'rm-suburbs', roam: true, scaleLimit: { min: 1, max: 15 }, aspectScale: 0.85,
                 itemStyle: { borderColor: cfCharts.c('rule'), borderWidth: 0.5, areaColor: cfCharts.rgba('muted', 0.35) },
                 emphasis: { label: { show: false }, itemStyle: { areaColor: 'inherit', borderColor: cfCharts.c('ink'), borderWidth: 1.5 } },
                 select: { disabled: true }, data: data }],
    });
  });
  cfCharts.buttons('f10-controls', [labels.angle, labels.err], function (v) {
    layer = v === labels.angle ? 'angle' : 'err'; f10.redraw();
  }, labels.angle);

  // F11: least-squares line across the plotted range, labelled with the Spearman rho from the export.
  var key = 'gam';
  var fit = function () {
    var n = d.points.length, mx = 0, my = 0, sxy = 0, sxx = 0;
    d.points.forEach(function (p) { mx += p.v / n; my += p[key] / n; });
    d.points.forEach(function (p) { sxy += (p.v - mx) * (p[key] - my); sxx += Math.pow(p.v - mx, 2); });
    var b = sxy / sxx, a = my - b * mx;
    return { id: 'fit', type: 'line', symbol: 'none', silent: true, data: [[10, a + 10 * b], [50, a + 50 * b]],
             lineStyle: { type: 'dashed', width: 2, color: cfCharts.c('ink') },
             endLabel: { show: true, formatter: 'Spearman ρ = ' + d.errors[key].rho.toFixed(2), color: cfCharts.c('ink'), offset: [-140, -14] } };
  };
  var f11 = cfCharts.chart('f11', function () {
    return Object.assign(cfCharts.base(), {
      grid: { left: 56, right: 16, top: 20, bottom: 48 },
      tooltip: cfCharts.tooltip({ trigger: 'item', formatter: function (p) {
        if (p.seriesId !== 'points') return '';
        var r = p.data.r;
        return '<b>' + r.n + '</b> · ' + r.y + '<br>view angle ' + r.v.toFixed(1) + '°<br>|raw MODIS error| ' + r.raw.toFixed(1) +
          ' pts<br>|GAM error| ' + r.gam.toFixed(1) + ' pts';
      } }),
      xAxis: cfCharts.axis('View angle, mean over the MODIS year (°)', { min: 10, max: 50 }),
      yAxis: cfCharts.axis('|Estimate − WA canopy| (pts)', { min: 0, max: 30 }),
      series: [
        { id: 'points', type: 'scatter', symbolSize: 5, itemStyle: { color: cfCharts.c('accent'), opacity: 0.45 },
          data: d.points.map(function (p) { return { value: [p.v, p[key]], r: p }; }) },
        fit(),
      ],
    });
  });
  cfCharts.buttons('f11-controls', ['GAM', 'Raw MODIS'], function (v) { key = v === 'GAM' ? 'gam' : 'raw'; f11.update(); }, 'GAM');
});
