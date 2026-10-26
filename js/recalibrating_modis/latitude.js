/* F8: mean error per suburb against latitude, raw MODIS or GAM, with banded means (±95% CI). */
cfCharts.load('f8_latitude.json').then(function (d) {
  var key = 'raw';
  var fig = cfCharts.chart('f8', function () {
    var b = d.bins;
    return Object.assign(cfCharts.base(), {
      grid: { left: 64, right: 20, top: 20, bottom: 50 },
      tooltip: cfCharts.tooltip({ trigger: 'item', formatter: function (p) {
        if (p.seriesId !== 'suburbs') return '';
        var r = p.data.r;
        return '<b>' + r.n + '</b><br>raw MODIS error ' + (r.raw >= 0 ? '+' : '') + r.raw.toFixed(1) +
          '<br>GAM error ' + (r.gam >= 0 ? '+' : '') + r.gam.toFixed(1);
      } }),
      xAxis: cfCharts.axis('Latitude (north →)', { min: -33, max: -31.4,
        axisLabel: { color: cfCharts.c('text-secondary'), showMaxLabel: false,
                     formatter: function (v) { return Math.abs(v).toFixed(1) + '°S'; } } }),
      yAxis: cfCharts.axis('Estimate − WA canopy (pts), mean over years', { min: -20, max: 25, nameGap: 40 }),
      series: [
        { id: 'suburbs', type: 'scatter', symbolSize: 5, itemStyle: { color: cfCharts.c('accent'), opacity: 0.35 },
          data: d.suburbs.map(function (r) { return { value: [r.lat, r[key]], r: r }; }) },
        cfCharts.band('ci', b.map(function (x) { return x.lat; }),
                b.map(function (x) { return x[key] - x[key + '_ci']; }),
                b.map(function (x) { return x[key] + x[key + '_ci']; }), cfCharts.rgba('ink', 0.12)),
        { id: 'mean', type: 'line', symbol: 'circle', symbolSize: 5, silent: true, lineStyle: { color: cfCharts.c('ink'), width: 2 },
          itemStyle: { color: cfCharts.c('ink') }, data: b.map(function (x) { return [x.lat, x[key]]; }),
          markLine: { symbol: 'none', data: [{ yAxis: 0 }], lineStyle: { color: cfCharts.c('muted'), type: 'dashed' }, label: { show: false } } },
      ],
    });
  });
  cfCharts.buttons('f8-controls', ['Raw MODIS', 'GAM'], function (v) { key = v === 'GAM' ? 'gam' : 'raw'; fig.update(); }, 'Raw MODIS');
});
