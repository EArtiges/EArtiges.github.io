/* F7: error vs unit size, suburbs and local government areas (LGAs). */
cfCharts.load('f7_units.json').then(function (d) {
  var key = 'raw', s = d.summary;
  var fig = cfCharts.chart('f7', function () {
    var pts = function (rows) { return rows.map(function (r) { return { value: [r.px, r[key]], r: r }; }); };
    var line = function (lvl) {
      return lvl.units + ' units: ' + lvl.raw_rmse.toFixed(2) + ' → ' + lvl.gam_cv_rmse.toFixed(2) + ' (−' + Math.round(lvl.gain_pct) + '%)';
    };
    return Object.assign(cfCharts.base(), {
      grid: { left: 60, right: 20, top: 70, bottom: 50 },
      title: { text: 'Suburbs ' + line(s.suburb) + '   ·   Councils ' + line(s.lga), left: 60, top: 4,
               textStyle: { fontSize: 12, fontWeight: 'normal', color: cfCharts.c('text-secondary') } },
      legend: { top: 28, left: 60, textStyle: { color: cfCharts.c('ink') }, data: ['Suburbs', 'Local government areas'] },
      tooltip: cfCharts.tooltip({ trigger: 'item', formatter: function (p) {
        var r = p.data.r;
        return '<b>' + r.n + '</b><br>' + Math.round(r.px) + ' MODIS pixels<br>raw MODIS RMSE ' + r.raw.toFixed(1) +
          '<br>GAM RMSE ' + r.gam.toFixed(1);
      } }),
      xAxis: cfCharts.axis('MODIS pixels per unit (log scale)', { type: 'log', min: 10, max: 100000 }),
      yAxis: cfCharts.axis((key === 'raw' ? 'Raw MODIS' : 'GAM') + ' RMSE over survey years (pts)', { min: 0, max: 20, nameGap: 40 }),
      series: [
        { id: 'sub', name: 'Suburbs', type: 'scatter', symbolSize: 6, itemStyle: { color: cfCharts.c('blue'), opacity: 0.55 }, data: pts(d.suburbs) },
        { id: 'lga', name: 'Local government areas', type: 'scatter', symbol: 'diamond', symbolSize: 12,
          itemStyle: { color: cfCharts.c('orange'), borderColor: cfCharts.c('bg'), borderWidth: 1 }, data: pts(d.lgas) },
      ],
    });
  });
  cfCharts.buttons('f7-controls', ['Raw MODIS', 'GAM'], function (v) { key = v === 'GAM' ? 'gam' : 'raw'; fig.update(); }, 'Raw MODIS');
});
