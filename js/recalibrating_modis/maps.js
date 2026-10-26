/* F1: WA canopy vs MODIS tree cover by suburb (toggle). F6: error reduction by suburb. */
// Canopy greens are not theme tokens: one fixed ramp for both modes, darker green = more trees.
var GREENS = ['#edf8e9', '#74c476', '#00441b'];

Promise.all([cfCharts.load('outlines.json'), cfCharts.load('f1_maps.json'), cfCharts.load('f6_reduction.json')]).then(function (res) {
  var geo = res[0], maps = res[1], red = res[2];
  echarts.registerMap('rm-suburbs', geo);
  var mapSeries = function (data, extra) {
    return Object.assign({
      type: 'map', map: 'rm-suburbs', roam: true, scaleLimit: { min: 1, max: 15 }, aspectScale: 0.85,
      itemStyle: { borderColor: cfCharts.c('rule'), borderWidth: 0.5, areaColor: cfCharts.rgba('muted', 0.35) },
      emphasis: { label: { show: false }, itemStyle: { areaColor: 'inherit', borderColor: cfCharts.c('ink'), borderWidth: 1.5 } },
      select: { disabled: true }, data: data,
    }, extra || {});
  };
  var legend = function (min, max, colors, text) {
    return { type: 'continuous', min: min, max: max, right: 8, top: 8, itemHeight: 120, calculable: false,
             text: text, textStyle: { color: cfCharts.c('text-secondary') }, inRange: { color: colors } };
  };

  // F1: suburbs coloured by WA canopy, or the MODIS pixels themselves under the suburb outlines.
  // Pixels come as a greyscale PNG on MODIS's sinusoidal grid; each is placed at its exact centre
  // (inverse sinusoidal: lat = y / R, lon = x / (R cos lat)) and drawn as a square sized from the zoom.
  // ECharts' fast "large" scatter mode draws one colour per series, so pixels are split into 2% bins.
  var g = maps.grid, DEG = 180 / Math.PI, BIN = 2, NBINS = 31, bins = [], pixSize = [2, 2];
  for (var i = 0; i < NBINS; i++) bins.push([]);
  var binColor = function (i) { return echarts.color.lerp(Math.min((i + 0.5) * BIN, 60) / 60, GREENS); };
  var layer = 'wa';
  var labels = { wa: 'WA canopy (' + maps.wa_year + ', suburbs)', modis: 'MODIS tree cover (' + maps.modis_year + ', pixels)' };
  var f1 = cfCharts.chart('f1', function () {
    var wa = layer === 'wa';
    return Object.assign(cfCharts.base(), {
      tooltip: cfCharts.tooltip({ trigger: 'item', formatter: function (p) {
        if (String(p.seriesId).indexOf('px') === 0) return 'MODIS pixel<br>tree cover ' + p.value[2] + '%';
        var s = p.data; if (!s) return '<b>' + p.name + '</b>';
        return '<b>' + p.name + '</b><br>WA canopy ' + cfCharts.pct(s.wa) + '<br>MODIS tree cover (suburb mean) ' + cfCharts.pct(s.modis) +
          (s.cov < 0.8 ? '<br><i>WA measured only ' + Math.round(s.cov * 100) + '% of the suburb</i>' : '');
      } }),
      visualMap: Object.assign(legend(0, 60, GREENS, ['60%', '0%']), { seriesIndex: wa ? 0 : [] }),
      geo: { map: 'rm-suburbs', roam: true, scaleLimit: { min: 1, max: 15 }, aspectScale: 0.85, z: wa ? 1 : 3, silent: !wa,
             itemStyle: { areaColor: wa ? cfCharts.neutral() : 'transparent', borderColor: wa ? cfCharts.c('rule') : cfCharts.rgba('ink', 0.35), borderWidth: 0.5 },
             emphasis: { disabled: !wa, label: { show: false }, itemStyle: { areaColor: 'inherit', borderColor: cfCharts.c('ink'), borderWidth: 1.5 } },
             select: { disabled: true }, label: { show: false } },
      series: wa
        ? [{ id: 'suburbs', type: 'map', geoIndex: 0, data: maps.suburbs.map(function (s) {
            return { name: s.n, value: s.wa, wa: s.wa, modis: s.modis, cov: s.cov }; }) }]
        : bins.map(function (data, i) {
            return { id: 'px' + i, type: 'scatter', coordinateSystem: 'geo', geoIndex: 0, z: 2, large: true, largeThreshold: 0,
                     symbol: 'rect', symbolSize: pixSize, itemStyle: { color: binColor(i), opacity: 1 }, data: data };
          }),
    });
  });

  // Screen size of one pixel at the current zoom, from two neighbouring pixel centres.
  var resizePixels = function () {
    var ref = bins[5][Math.floor(bins[5].length / 2)];
    if (layer !== 'modis' || !ref) return;
    var lat = ref[1] / DEG;
    var dlon = g.size / (g.radius * Math.cos(lat)) * DEG, dlat = g.size / g.radius * DEG;
    var a = f1.chart.convertToPixel({ geoIndex: 0 }, [ref[0], ref[1]]);
    var b = f1.chart.convertToPixel({ geoIndex: 0 }, [ref[0] + dlon, ref[1] + dlat]);
    pixSize = [Math.abs(b[0] - a[0]) + 0.6, Math.abs(b[1] - a[1]) + 0.6];
    f1.chart.setOption({ series: bins.map(function (_, i) { return { id: 'px' + i, symbolSize: pixSize }; }) });
  };
  f1.chart.on('georoam', resizePixels);

  var img = new Image();
  img.onload = function () {
    var canvas = document.createElement('canvas');
    canvas.width = g.width; canvas.height = g.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var px = ctx.getImageData(0, 0, g.width, g.height).data;
    for (var r = 0; r < g.height; r++) {
      for (var c = 0; c < g.width; c++) {
        var v = px[(r * g.width + c) * 4];
        if (v === 255) continue;
        var lat = (g.y0 - (r + 0.5) * g.size) / g.radius;
        var lon = (g.x0 + (c + 0.5) * g.size) / (g.radius * Math.cos(lat));
        bins[Math.min(Math.floor(v / BIN), NBINS - 1)].push([lon * DEG, lat * DEG, v]);
      }
    }
  };
  img.src = cfCharts.url(g.png);

  cfCharts.buttons('f1-controls', [labels.wa, labels.modis], function (v) {
    layer = v === labels.wa ? 'wa' : 'modis';
    f1.redraw();
    resizePixels();
  }, labels.wa);

  // F6
  var LIM = 5, modelled = {};
  red.suburbs.forEach(function (s) { modelled[s.n] = s; });
  cfCharts.chart('f6', function () {
    var data = geo.features.map(function (f) {
      var s = modelled[f.properties.name];
      return s ? { name: s.n, value: s.red, raw: s.raw, gam: s.gam } : { name: f.properties.name, value: null,
        itemStyle: { areaColor: cfCharts.c('bg'), decal: { symbol: 'rect', symbolSize: 1, dashArrayX: [1, 0], dashArrayY: [2, 5],
                                                     rotation: -Math.PI / 4, color: cfCharts.rgba('muted', 0.7) } } };
    });
    return Object.assign(cfCharts.base(), {
      tooltip: cfCharts.tooltip({ trigger: 'item', formatter: function (p) {
        var s = p.data; if (!s || s.value === null) return '<b>' + p.name + '</b><br>not modelled (WA measured <80%)';
        return '<b>' + p.name + '</b><br>raw MODIS RMSE ' + s.raw.toFixed(1) + '<br>GAM RMSE ' + s.gam.toFixed(1) +
          '<br>reduction ' + (s.value >= 0 ? '+' : '') + s.value.toFixed(1) + ' pts';
      } }),
      visualMap: legend(-LIM, LIM, [cfCharts.c('orange'), cfCharts.neutral(), cfCharts.c('blue')], ['+' + LIM + ' better', '−' + LIM + ' worse']),
      series: [mapSeries(data)],
    });
  });
});
