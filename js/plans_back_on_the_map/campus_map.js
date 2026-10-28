/* M1 and M3: every Cal Poly plan, first scattered on a "table" below the campus in its own
   coordinates, then flown onto the OSM campus by the transform auto_match found.
   Plans come as rings in their own local frame (inches, relative to their centroid) plus
   the map z -> a z + b onto campus feet; the flight interpolates scale, angle and position,
   so pieces move rigidly. Plans auto_match left unmatched stay on the table.
   M1 ('pieces'): one cell per plan, all pieces fly together with a short stagger.
   M3 ('groups'): one cell per building, keeping its plans' layout, and the buildings fly one
   after the other. A building placed by one transform moves as one block; a building placed
   building by building has no shared move, so its pieces fly separately, in its turn. */
cfCharts.load('m1_campus.json').then(function (d) {
  var METHOD = { transform_search: 'whole site', dumb_match: 'building by building', already_aligned: 'already aligned' };
  var CREDIT = '<span style="opacity:.7;font-size:11px">Plans: Cal Poly · Outlines: © OpenStreetMap contributors</span>';

  echarts.registerMap('pb-campus', d.osm);
  var labels = {};
  d.osm.features.forEach(function (f) { labels[f.properties.name] = f.properties.label; });

  // Campus core: the bounding box of the OSM buildings that some plan group points to.
  var inGroup = {}; d.groups.forEach(function (g) { inGroup[g.g] = true; });
  var core = [Infinity, Infinity, -Infinity, -Infinity];
  d.osm.features.forEach(function (f) {
    if (!inGroup[f.properties.group]) return;
    f.geometry.coordinates[0].forEach(function (p) {
      core[0] = Math.min(core[0], p[0]); core[1] = Math.min(core[1], p[1]);
      core[2] = Math.max(core[2], p[0]); core[3] = Math.max(core[3], p[1]);
    });
  });
  var pad = 150; core = [core[0] - pad, core[1] - pad, core[2] + pad, core[3] + pad];
  var W = core[2] - core[0], H = core[3] - core[1], gap = 0.06 * H;

  function radius(p) { var r = 0; p.rings[0].forEach(function (q) { r = Math.max(r, Math.hypot(q[0], q[1])); }); return r; }
  function polar(a) { return { s: Math.hypot(a[0], a[1]), th: Math.atan2(a[1], a[0]) }; }
  // A grid of n cells below the core, as wide as the core; returns cell centres and size.
  function grid(n) {
    var cell = Math.sqrt(W * 0.55 * H / n), cols = Math.floor(W / cell), rows = Math.ceil(n / cols);
    var x0 = core[0] + (W - cols * cell) / 2, top = core[1] - gap;
    return { cell: cell, bottom: top - rows * cell,
             at: function (k) { return { x: x0 + (k % cols + 0.5) * cell, y: top - (Math.floor(k / cols) + 0.5) * cell }; } };
  }

  // Each piece gets start and end poses {s, th, x, y}, a delay and a flight length in units of t,
  // and optionally a group pose (rigid groups in M3) from which its own pose is derived.
  function layout(mode) {
    var pieces = [], table;
    if (mode === 'pieces') {
      d.groups.forEach(function (g) { g.plans.forEach(function (p) { pieces.push({ g: g, p: p }); }); });
      table = grid(pieces.length);
      pieces.forEach(function (piece, k) {
        var c = table.at(k);
        piece.start = { s: 0.42 * table.cell / radius(piece.p), th: 0, x: c.x, y: c.y };
        piece.end = piece.p.a ? Object.assign(polar(piece.p.a), { x: piece.p.b[0], y: piece.p.b[1] }) : piece.start;
        piece.delay = (k / pieces.length) * 0.5; piece.flight = 0.5;
      });
      return { pieces: pieces, bottom: table.bottom, duration: 2400 };
    }
    table = grid(d.groups.length);
    d.groups.forEach(function (g, k) {
      var c = table.at(k), delay = (k / d.groups.length) * 0.85, flight = 0.15;
      var placed = g.plans.filter(function (p) { return p.a; });
      if (g.rigid && placed.length) {
        // The group as a block: start scaled to fit its cell, end where the shared transform puts its centre.
        var R = 0;
        g.plans.forEach(function (p) { R = Math.max(R, Math.hypot(p.o[0], p.o[1]) + radius(p)); });
        var a = placed[0].a, o = placed[0].o;
        var group = { start: { s: 0.42 * table.cell / R, th: 0, x: c.x, y: c.y },
                      end: Object.assign(polar(a), { x: placed[0].b[0] - (a[0] * o[0] - a[1] * o[1]),
                                                     y: placed[0].b[1] - (a[1] * o[0] + a[0] * o[1]) }) };
        g.plans.forEach(function (p) { pieces.push({ g: g, p: p, group: group, delay: delay, flight: flight }); });
      } else {
        // No shared move: lay the pieces side by side within the cell, each flies on its own.
        var n = g.plans.length, side = Math.ceil(Math.sqrt(n)), sub = table.cell / side;
        g.plans.forEach(function (p, i) {
          var start = { s: 0.42 * sub / radius(p), th: 0,
                        x: c.x - table.cell / 2 + (i % side + 0.5) * sub, y: c.y + table.cell / 2 - (Math.floor(i / side) + 0.5) * sub };
          pieces.push({ g: g, p: p, start: start, delay: delay, flight: flight,
                        end: p.a ? Object.assign(polar(p.a), { x: p.b[0], y: p.b[1] }) : start });
        });
      }
    });
    return { pieces: pieces, bottom: table.bottom, duration: 9000 };
  }

  function ease(u) { return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; }
  function between(a, b, u) {
    var dth = Math.atan2(Math.sin(b.th - a.th), Math.cos(b.th - a.th)); // shortest turn
    return { s: Math.exp(Math.log(a.s) + u * (Math.log(b.s) - Math.log(a.s))), th: a.th + u * dth,
             x: a.x + u * (b.x - a.x), y: a.y + u * (b.y - a.y) };
  }
  function pose(piece, t) {
    var u = ease(Math.min(1, Math.max(0, (t - piece.delay) / piece.flight)));
    if (!piece.group) return between(piece.start, piece.end, u);
    // A plan in a moving block: its centroid is the block's map applied to its offset in the group.
    var q = between(piece.group.start, piece.group.end, u), o = piece.p.o;
    var c = Math.cos(q.th) * q.s, s = Math.sin(q.th) * q.s;
    return { s: q.s, th: q.th, x: q.x + c * o[0] - s * o[1], y: q.y + s * o[0] + c * o[1] };
  }

  var geoProjection = { project: function (p) { return [p[0], -p[1]]; }, unproject: function (p) { return [p[0], -p[1]]; } };

  function campusMap(id, mode) {
    var L = layout(mode), pieces = L.pieces, t = 0; // 0 = scattered, 1 = aligned
    var fig = cfCharts.chart(id, function () {
      var regions = d.osm.features.filter(function (f) { return inGroup[f.properties.group]; }).map(function (f) {
        return { name: f.properties.name, itemStyle: { areaColor: cfCharts.rgba('ink', 0.22), borderColor: cfCharts.c('text-secondary') } };
      });
      return Object.assign(cfCharts.base(), {
        tooltip: cfCharts.tooltip({ trigger: 'item', formatter: function (prm) {
          if (prm.componentType === 'geo') {
            var label = labels[prm.name];
            return (label ? '<b>' + label + '</b><br>' : '') + 'OpenStreetMap outline<br>' + CREDIT;
          }
          var piece = pieces[prm.dataIndex], g = piece.g;
          // Before the pieces land, don't give the answer away.
          if (t < 1) return '<b>Plan ' + piece.p.id.replace('Building', '') + '</b><br>Position unknown<br>' + CREDIT;
          var how = piece.p.a ? METHOD[g.method] : 'not placed';
          return '<b>' + (g.name || 'Building ' + g.g) + '</b><br>Plan ' + piece.p.id.replace('Building', '') +
            '<br>Placed: ' + how + (piece.p.a ? '<br>Score ' + g.score.toFixed(2) : '') + '<br>' + CREDIT;
        } }),
        geo: {
          map: 'pb-campus', projection: geoProjection, roam: true, scaleLimit: { min: 0.8, max: 30 },
          boundingCoords: [[core[0], core[3]], [core[2], L.bottom]],
          itemStyle: { areaColor: cfCharts.neutral(), borderColor: cfCharts.c('muted'), borderWidth: 0.4 },
          emphasis: { label: { show: false }, itemStyle: { areaColor: cfCharts.rgba('ink', 0.4) } },
          select: { disabled: true }, label: { show: false }, regions: regions
        },
        series: [{
          id: 'plans', type: 'custom', coordinateSystem: 'geo', animation: false,
          data: pieces.map(function (_, k) { return k; }),
          renderItem: function (params, api) {
            var piece = pieces[params.dataIndex], q = pose(piece, t);
            var c = Math.cos(q.th) * q.s, s = Math.sin(q.th) * q.s;
            var path = piece.p.rings.map(function (ring) {
              return ring.map(function (v, i) {
                var px = api.coord([q.x + c * v[0] - s * v[1], q.y + s * v[0] + c * v[1]]);
                return (i ? 'L' : 'M') + px[0].toFixed(1) + ' ' + px[1].toFixed(1);
              }).join('') + 'Z';
            }).join('');
            var placed = !!piece.p.a;
            return { type: 'path', shape: { pathData: path },
                     style: { fill: cfCharts.rgba('accent', placed ? 0.35 : 0.15), stroke: cfCharts.c('accent'),
                              lineWidth: 1, lineDash: placed || t === 0 ? null : [3, 2] } };
          }
        }]
      });
    });

    // Re-run renderItem for every frame of the flight (the geo view itself doesn't change).
    function redrawPieces() { fig.chart.setOption({ series: [{ id: 'plans', data: pieces.map(function (_, k) { return k; }) }] }); }
    // Redraw the plans on every zoom or pan step, so they can't lag behind the map's own outlines.
    fig.chart.on('georoam', redrawPieces);
    var frame = null;
    function fly(target) {
      if (frame) cancelAnimationFrame(frame);
      var from = t, startTime = null, duration = L.duration * Math.abs(target - from);
      function step(now) {
        if (startTime === null) startTime = now;
        var u = duration ? Math.min(1, (now - startTime) / duration) : 1;
        t = from + (target - from) * u;
        redrawPieces();
        frame = u < 1 ? requestAnimationFrame(step) : null;
      }
      frame = requestAnimationFrame(step);
    }
    cfCharts.buttons(id + '-controls', ['Scattered', 'Aligned'], function (v) { fly(v === 'Aligned' ? 1 : 0); }, 'Scattered');
  }

  campusMap('m1', 'pieces');
  if (document.getElementById('m3')) campusMap('m3', 'groups');
});
