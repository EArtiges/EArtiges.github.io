/* F1: one plan group (172) and the transform that lays it on the map. Sliders move the plan
   by hand, with the overlap computed live (polygon-clipping); Search replays the real run:
   1,000 sampled guesses (faint), then the Nelder-Mead path that polished the best ones.
   A pose is [a_re, a_im, b_x, b_y, overlap]: plan-local z -> a z + b, in campus feet. */
cfCharts.load('f1_one_transform.json').then(function (d) {
  var CREDIT = '<span style="opacity:.7;font-size:11px">Plans: Cal Poly · Outlines: © OpenStreetMap contributors</span>';
  echarts.registerMap('pb-f1', d.osm);
  var labels = {}, truth = [];
  d.osm.features.forEach(function (f) {
    labels[f.properties.name] = f.properties.label;
    if (f.properties.group === d.g) truth.push(f.geometry.coordinates);
  });

  // ---- geometry --------------------------------------------------------------------------
  function place(pose, ring) {
    return ring.map(function (v) { return [pose[0] * v[0] - pose[1] * v[1] + pose[2], pose[1] * v[0] + pose[0] * v[1] + pose[3]]; });
  }
  function placed(pose) {
    return d.plans.map(function (rings) { return rings.map(function (r) { var p = place(pose, r); p.push(p[0]); return p; }); });
  }
  function ringArea(r) { var s = 0; for (var i = 0; i < r.length - 1; i++) s += r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1]; return s / 2; }
  function area(multi) {
    return multi.reduce(function (s, poly) {
      return s + Math.abs(ringArea(poly[0])) - poly.slice(1).reduce(function (h, r) { return h + Math.abs(ringArea(r)); }, 0);
    }, 0);
  }
  var truthClosed = truth.map(function (poly) { return poly.map(function (r) { return r.concat([r[0]]); }); });
  var truthUnion = polygonClipping.union.apply(null, truthClosed);
  function overlap(pose) { // group IoU of the plans' union against the OSM buildings' union, as the matcher scores it
    var plansUnion = polygonClipping.union.apply(null, placed(pose));
    var inter = area(polygonClipping.intersection(plansUnion, truthUnion));
    return inter / (area(plansUnion) + area(truthUnion) - inter);
  }

  // ---- state: the pose shown, its sliders, and the ghosts of the replay --------------------
  function toParams(pose) {
    return { s: Math.hypot(pose[0], pose[1]), th: Math.atan2(pose[1], pose[0]) * 180 / Math.PI, x: pose[2], y: pose[3] };
  }
  function toPose(q) {
    var th = q.th * Math.PI / 180;
    return [q.s * Math.cos(th), q.s * Math.sin(th), q.x, q.y];
  }
  var start = toParams(d.prior), pose = d.prior.slice(0, 4), ghosts = [], status = '';
  var score = overlap(pose);

  // ---- sliders ---------------------------------------------------------------------------
  // Scale and rotation sit in the controls above the figure; the shifts run along the figure's
  // edges, like a map's axes: east along the top, north up the left side (bottom = south).
  // The figure is wrapped in a grid before the chart is created, so ECharts sizes to its cell.
  var controls = document.getElementById('f1-controls');
  var sliderBox = document.createElement('div');
  sliderBox.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:4px 24px;margin-top:8px;font-size:13px';
  var figure = document.getElementById('f1'), frameBox = document.createElement('div');
  // The left column is sized by hand: grids don't count sideways text when sizing an auto column.
  frameBox.style.cssText = 'display:grid;grid-template-columns:46px minmax(0,1fr);grid-template-rows:auto auto;column-gap:6px;font-size:13px';
  figure.parentNode.insertBefore(frameBox, figure);
  var topEdge = document.createElement('label'), leftEdge = document.createElement('label');
  topEdge.style.cssText = 'display:block;grid-column:2;grid-row:1';
  leftEdge.style.cssText = 'display:flex;gap:2px;justify-content:flex-end;grid-column:1;grid-row:2;height:' + figure.style.height;
  frameBox.appendChild(topEdge); frameBox.appendChild(leftEdge);
  figure.style.gridColumn = '2'; figure.style.gridRow = '2'; frameBox.appendChild(figure);
  var SLIDERS = [
    { key: 's', label: 'Scale', min: Math.log(1 / 24), max: Math.log(1 / 6), step: 0.001, log: true,
      fmt: function (v) { return '1 plan unit = ' + v.toFixed(4) + ' ft (1/' + (1 / v).toFixed(1) + ')'; } },
    { key: 'th', label: 'Rotation', min: -180, max: 180, step: 0.1, fmt: function (v) { return (Math.abs(v) < 0.05 ? 0 : v).toFixed(1) + '°'; } },
    { key: 'x', label: 'Shift east', edge: 'top', min: start.x - 400, max: start.x + 400, step: 0.5,
      fmt: function (v) { return (v - start.x >= 0 ? '+' : '') + (v - start.x).toFixed(0) + ' ft'; } },
    { key: 'y', label: 'Shift north', edge: 'left', min: start.y - 400, max: start.y + 400, step: 0.5,
      fmt: function (v) { return (v - start.y >= 0 ? '+' : '') + (v - start.y).toFixed(0) + ' ft'; } }
  ];
  SLIDERS.forEach(function (sl) {
    var wrap = sl.edge === 'top' ? topEdge : sl.edge === 'left' ? leftEdge : document.createElement('label');
    var text = document.createElement('span'), input = document.createElement('input');
    input.type = 'range'; input.min = sl.min; input.max = sl.max; input.step = sl.step;
    input.style.accentColor = cfCharts.c('accent');
    input.setAttribute('aria-label', sl.label);
    if (sl.edge === 'left') {
      // Vertical, north at the top; the label sits outside it and reads upwards, like a y-axis.
      input.setAttribute('orient', 'vertical');
      input.style.cssText += ';writing-mode:vertical-lr;direction:rtl;width:22px;height:100%;margin:0';
      text.style.cssText = 'writing-mode:vertical-rl;transform:rotate(180deg);white-space:nowrap;text-align:right';
      wrap.appendChild(text); wrap.appendChild(input);
    } else {
      input.style.width = '100%'; input.style.display = 'block'; input.style.margin = '2px 0 4px';
      wrap.appendChild(text); wrap.appendChild(input);
      if (!sl.edge) sliderBox.appendChild(wrap);
    }
    sl.input = input; sl.text = text;
    input.addEventListener('input', function () { stopReplay(); readSliders(); });
  });
  function writeSliders() {
    var q = toParams(pose);
    SLIDERS.forEach(function (sl) {
      sl.input.value = sl.log ? Math.log(q[sl.key]) : q[sl.key];
      sl.text.textContent = sl.label + ': ' + sl.fmt(q[sl.key]);
    });
  }
  function readSliders() {
    var q = {};
    SLIDERS.forEach(function (sl) { var v = +sl.input.value; q[sl.key] = sl.log ? Math.exp(v) : v; sl.text.textContent = sl.label + ': ' + sl.fmt(q[sl.key]); });
    pose = toPose(q); ghosts = []; score = overlap(pose); status = 'by hand'; redrawPlans();
  }

  // ---- chart -----------------------------------------------------------------------------
  var items = [];
  function rebuildItems() {
    items = [];
    ghosts.forEach(function (g, k) { d.plans.forEach(function (_, i) { items.push({ pose: g, plan: i, ghost: (k + 1) / ghosts.length }); }); });
    d.plans.forEach(function (_, i) { items.push({ pose: pose, plan: i, ghost: 0 }); });
  }
  var bounds = [Infinity, Infinity, -Infinity, -Infinity];
  truth.forEach(function (poly) { poly[0].forEach(function (p) {
    bounds[0] = Math.min(bounds[0], p[0]); bounds[1] = Math.min(bounds[1], p[1]);
    bounds[2] = Math.max(bounds[2], p[0]); bounds[3] = Math.max(bounds[3], p[1]);
  }); });
  var m = 260;
  var fig = cfCharts.chart('f1', function () {
    return Object.assign(cfCharts.base(), {
      tooltip: cfCharts.tooltip({ trigger: 'item', formatter: function (prm) {
        if (prm.componentType === 'geo') {
          var label = labels[prm.name];
          return (label ? '<b>' + label + '</b><br>' : '') + 'OpenStreetMap outline<br>' + CREDIT;
        }
        return '<b>Plan of building ' + d.g + '</b><br>Score ' + score.toFixed(2) + '<br>' + CREDIT;
      } }),
      graphic: [{ id: 'readout', type: 'text', left: 12, top: 10, z: 10,
                  style: { text: 'Score ' + score.toFixed(2) + (status ? '   ·   ' + status : ''),
                           fill: cfCharts.c('ink'), font: '600 15px ' + cfCharts.base().textStyle.fontFamily } }],
      geo: {
        map: 'pb-f1', roam: true, scaleLimit: { min: 0.6, max: 12 },
        projection: { project: function (p) { return [p[0], -p[1]]; }, unproject: function (p) { return [p[0], -p[1]]; } },
        boundingCoords: [[bounds[0] - m, bounds[3] + m], [bounds[2] + m, bounds[1] - m]],
        itemStyle: { areaColor: cfCharts.neutral(), borderColor: cfCharts.c('muted'), borderWidth: 0.4 },
        emphasis: { label: { show: false }, itemStyle: { areaColor: cfCharts.rgba('ink', 0.4) } },
        select: { disabled: true }, label: { show: false },
        regions: d.osm.features.filter(function (f) { return f.properties.group === d.g; }).map(function (f) {
          return { name: f.properties.name, itemStyle: { areaColor: cfCharts.rgba('ink', 0.22), borderColor: cfCharts.c('text-secondary') } };
        })
      },
      series: [{
        id: 'plans', type: 'custom', coordinateSystem: 'geo', animation: false,
        data: items.map(function (_, k) { return k; }),
        renderItem: function (params, api) {
          var it = items[params.dataIndex];
          var path = d.plans[it.plan].map(function (ring) {
            return place(it.pose, ring).map(function (v, i) {
              var px = api.coord(v); return (i ? 'L' : 'M') + px[0].toFixed(1) + ' ' + px[1].toFixed(1);
            }).join('') + 'Z';
          }).join('');
          var style = it.ghost
            ? { fill: 'none', stroke: cfCharts.rgba('accent', 0.08 + 0.25 * it.ghost), lineWidth: 0.8 }
            : { fill: cfCharts.rgba('accent', 0.35), stroke: cfCharts.c('accent'), lineWidth: 1.2 };
          return { type: 'path', silent: !!it.ghost, shape: { pathData: path }, style: style };
        }
      }]
    });
  });
  // Redraw the plans on every zoom or pan step, so they can't lag behind the map's own outlines.
  fig.chart.on('georoam', function () { redrawPlans(); });
  function redrawPlans() {
    rebuildItems();
    fig.chart.setOption({
      graphic: [{ id: 'readout', style: { text: 'Score ' + score.toFixed(2) + (status ? '   ·   ' + status : '') } }],
      series: [{ id: 'plans', data: items.map(function (_, k) { return k; }) }]
    });
  }

  // ---- replay ----------------------------------------------------------------------------
  var frame = null;
  function stopReplay() { if (frame) cancelAnimationFrame(frame); frame = null; }
  function replay() {
    stopReplay();
    var SAMPLE_MS = 4000, PATH_MS = 3000, GHOSTS = 20, t0 = null, best = null;
    function step(now) {
      if (t0 === null) t0 = now;
      var el = now - t0;
      if (el < SAMPLE_MS) {
        var n = Math.max(1, Math.floor(d.samples.length * el / SAMPLE_MS));
        best = d.samples.slice(0, n).reduce(function (b, s) { return !b || s[4] > b[4] ? s : b; }, null);
        ghosts = d.samples.slice(Math.max(0, n - GHOSTS), n);
        pose = best.slice(0, 4); score = best[4];
        status = 'guess ' + n + ' of ' + d.samples.length;
      } else {
        var k = Math.min(d.path.length - 1, Math.floor(d.path.length * (el - SAMPLE_MS) / PATH_MS));
        ghosts = []; pose = d.path[k].slice(0, 4); score = d.path[k][4];
        status = k < d.path.length - 1 ? 'polishing, step ' + (k + 1) : 'done: best of 1,000 guesses, polished';
      }
      redrawPlans(); writeSliders();
      frame = el < SAMPLE_MS + PATH_MS ? requestAnimationFrame(step) : null;
    }
    frame = requestAnimationFrame(step);
  }

  cfCharts.buttons('f1-controls', ['Start over', 'Search'], function (v) {
    if (v === 'Search') { replay(); return; }
    stopReplay(); pose = d.prior.slice(0, 4); ghosts = []; score = d.prior[4]; status = ''; writeSliders(); redrawPlans();
  }, null);
  controls.appendChild(sliderBox);
  writeSliders(); redrawPlans();
});
