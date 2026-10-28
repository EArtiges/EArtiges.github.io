/* M2: building 172's plans wait to the left of the OSM buildings, in their files' layout,
   dashed. A strategy button slides them into place: whole site as one block, building by
   building one plan at a time, each to its own building. A plan that lands on the right
   building gets a solid outline, one on the wrong building a magenta one; an unmatched plan
   stays behind, dashed. Reset puts every plan back where it waited. Poses are plan-local
   z -> a z + b in campus feet, interpolated in scale, angle and position, so plans stay rigid. */
cfCharts.load('m2_hard_cases.json').then(function (d) {
  var CREDIT = '<span style="opacity:.7;font-size:11px">Plans: Cal Poly · Outlines: © OpenStreetMap contributors</span>';
  var STRATEGIES = { 'Whole site': 'transform_search', 'Building by building': 'dumb_match' };
  var TIMING = { transform_search: { flight: 1400, step: 0 }, dumb_match: { flight: 900, step: 450 } };
  echarts.registerMap('pb-m2', d.osm);

  var labels = {}, b = [Infinity, Infinity, -Infinity, -Infinity];
  d.osm.features.forEach(function (f) {
    labels[f.properties.name] = f.properties.label;
    if (f.properties.group !== d.g) return;
    f.geometry.coordinates[0].forEach(function (p) {
      b[0] = Math.min(b[0], p[0]); b[1] = Math.min(b[1], p[1]); b[2] = Math.max(b[2], p[0]); b[3] = Math.max(b[3], p[1]);
    });
  });
  var shift = 1.25 * (b[2] - b[0]), m = 0.12 * (b[3] - b[1]);

  function polar(a, bb) { return { s: Math.hypot(a[0], a[1]), th: Math.atan2(a[1], a[0]), x: bb[0], y: bb[1] }; }
  // Start: where the whole site puts each plan, slid left of the buildings.
  var wholeSite = d.strategies.transform_search.plans;
  var start = wholeSite.map(function (p) { var q = polar(p.a, p.b); q.x -= shift; return q; });

  var strategy = null, landed = d.plans.map(function () { return false; }), poses = start.slice(), frame = null;

  function ease(u) { return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }
  function between(a, c, u) {
    var dth = Math.atan2(Math.sin(c.th - a.th), Math.cos(c.th - a.th));
    return { s: Math.exp(Math.log(a.s) + u * (Math.log(c.s) - Math.log(a.s))), th: a.th + u * dth,
             x: a.x + u * (c.x - a.x), y: a.y + u * (c.y - a.y) };
  }
  function plan(i) { return strategy ? d.strategies[strategy].plans[i] : null; }

  function readout() {
    if (!strategy || landed.indexOf(false) !== -1) return '';
    var ps = d.strategies[strategy].plans, n = ps.length;
    var right = ps.filter(function (p) { return p.right; }).length, out = ps.filter(function (p) { return !p.a; }).length;
    return 'Score ' + d.strategies[strategy].score.toFixed(2) + '   ·   ' + right + ' of ' + n + ' plans on the right building' +
      (out ? ' (' + out + ' unmatched)' : '');
  }

  var fig = cfCharts.chart('m2', function () {
    var font = cfCharts.base().textStyle.fontFamily;
    function key(x, label, stroke, dash) {
      return [{ type: 'rect', shape: { x: x, y: 1, width: 18, height: 12, r: 1 },
                style: { fill: cfCharts.rgba('accent', 0.35), stroke: stroke, lineWidth: 2, lineDash: dash } },
              { type: 'text', x: x + 24, y: 1, style: { text: label, fill: cfCharts.c('ink'), font: '13px ' + font } }];
    }
    return Object.assign(cfCharts.base(), {
      tooltip: cfCharts.tooltip({ trigger: 'item', formatter: function (prm) {
        if (prm.componentType === 'geo') {
          var label = labels[prm.name];
          return (label ? '<b>' + label + '</b><br>' : '') + 'OpenStreetMap outline<br>' + CREDIT;
        }
        var i = prm.dataIndex, p = plan(i), id = d.plans[i].id.replace('Building', '').replace(/^0+/, '');
        if (!p || !landed[i]) return '<b>Plan ' + id + '</b><br>Not placed yet<br>' + CREDIT;
        if (!p.a) return '<b>Plan ' + id + '</b><br>Unmatched<br>' + CREDIT;
        return '<b>Plan ' + id + '</b><br>Put on: ' + p.onto + (p.right ? '' : ' <b>(wrong building)</b>') + '<br>' + CREDIT;
      } }),
      graphic: [
        { id: 'readout', type: 'text', left: 12, top: 10, z: 10,
          style: { text: readout(), fill: cfCharts.c('ink'), font: '600 14px ' + font } },
        { id: 'legend', type: 'group', left: 12, bottom: 10, z: 10,
          children: key(0, 'Correct match', cfCharts.c('accent'), null)
            .concat(key(130, 'Incorrect match', cfCharts.c('magenta'), null))
            .concat(key(265, 'Unmatched', cfCharts.c('accent'), [3, 2])) }
      ],
      geo: {
        map: 'pb-m2', roam: true, scaleLimit: { min: 0.6, max: 12 },
        projection: { project: function (p) { return [p[0], -p[1]]; }, unproject: function (p) { return [p[0], -p[1]]; } },
        boundingCoords: [[b[0] - shift - m, b[3] + m], [b[2] + m, b[1] - m]],
        itemStyle: { areaColor: cfCharts.neutral(), borderColor: cfCharts.c('muted'), borderWidth: 0.4 },
        emphasis: { label: { show: false }, itemStyle: { areaColor: cfCharts.rgba('ink', 0.4) } },
        select: { disabled: true }, label: { show: false },
        regions: d.osm.features.filter(function (f) { return f.properties.group === d.g; }).map(function (f) {
          return { name: f.properties.name, itemStyle: { areaColor: cfCharts.rgba('ink', 0.22), borderColor: cfCharts.c('text-secondary') } };
        })
      },
      series: [{
        id: 'plans', type: 'custom', coordinateSystem: 'geo', animation: false,
        data: d.plans.map(function (_, i) { return i; }),
        renderItem: function (params, api) {
          var i = params.dataIndex, q = poses[i], p = plan(i);
          var c = Math.cos(q.th) * q.s, s = Math.sin(q.th) * q.s;
          var path = d.plans[i].rings.map(function (ring) {
            return ring.map(function (v, k) {
              var px = api.coord([q.x + c * v[0] - s * v[1], q.y + s * v[0] + c * v[1]]);
              return (k ? 'L' : 'M') + px[0].toFixed(1) + ' ' + px[1].toFixed(1);
            }).join('') + 'Z';
          }).join('');
          // Dashed until a plan lands on a building: waiting, or unmatched by the strategy.
          var wrong = p && landed[i] && p.a && !p.right, dashed = !p || !landed[i] || !p.a;
          return { type: 'path', shape: { pathData: path },
                   style: { fill: cfCharts.rgba('accent', dashed ? 0.15 : 0.35),
                            stroke: cfCharts.c(wrong ? 'magenta' : 'accent'), lineWidth: wrong ? 2.2 : 1.2,
                            lineDash: dashed ? [3, 2] : null } };
        }
      }]
    });
  });

  // Redraw the plans on every zoom or pan step, so they can't lag behind the map's own outlines.
  fig.chart.on('georoam', function () { redraw(); });
  function redraw() {
    fig.chart.setOption({ graphic: [{ id: 'readout', style: { text: readout() } }],
                          series: [{ id: 'plans', data: d.plans.map(function (_, i) { return i; }) }] });
  }
  function slide(name) {
    if (frame) cancelAnimationFrame(frame);
    strategy = name; landed = d.plans.map(function () { return false; }); poses = start.slice();
    var timing = TIMING[name], t0 = null;
    var ends = d.strategies[name].plans.map(function (p, i) { return p.a ? polar(p.a, p.b) : start[i]; });
    var total = timing.flight + timing.step * (d.plans.length - 1);
    function step(now) {
      if (t0 === null) t0 = now;
      var el = now - t0;
      poses = ends.map(function (end, i) {
        var u = Math.min(1, Math.max(0, (el - i * timing.step) / timing.flight));
        landed[i] = u >= 1;
        return between(start[i], end, ease(u));
      });
      redraw();
      frame = el < total ? requestAnimationFrame(step) : null;
    }
    frame = requestAnimationFrame(step);
  }
  function reset() {
    if (frame) cancelAnimationFrame(frame);
    frame = null; strategy = null; landed = d.plans.map(function () { return false; }); poses = start.slice();
    redraw();
  }
  cfCharts.buttons('m2-controls', Object.keys(STRATEGIES).concat(['Reset']), function (v) {
    if (v === 'Reset') reset(); else slide(STRATEGIES[v]);
  }, null);
  document.getElementById('m2-controls').style.textAlign = 'right';
});
