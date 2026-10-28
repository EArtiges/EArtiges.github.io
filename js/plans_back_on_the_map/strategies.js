/* F2: on the 32 answer-key buildings, which selection rule ends up right. One row per rule,
   one cell per building: blue = the attempt the rule keeps is right, orange = wrong. */
cfCharts.load('f2_rules.json').then(function (d) {
  var RULES = [
    { key: 'whole_first', label: 'Whole site first' },
    { key: 'best_score', label: 'Best score' },
    { key: 'pairwise', label: 'Building by building' },
    { key: 'whole', label: 'Whole site' }
  ];
  var ATTEMPT = { whole: 'whole site', pairwise: 'building by building' };

  function rightUnder(r, rule) { return r.right[r.keeps[rule]]; }
  var tally = {};
  RULES.forEach(function (rule) {
    tally[rule.key] = d.groups.filter(function (r) { return rightUnder(r, rule.key); }).length;
  });

  cfCharts.chart('f2', function () {
    var groups = d.groups;
    var cells = [];
    groups.forEach(function (r, x) {
      RULES.forEach(function (rule, y) { cells.push({ value: [x, y], r: r, rule: rule }); });
    });
    return Object.assign(cfCharts.base(), {
      grid: { left: 190, right: 16, top: 16, bottom: 70 },
      graphic: [{ type: 'group', left: 12, bottom: 10, children: [
        { type: 'rect', shape: { x: 0, y: 2, width: 12, height: 12, r: 2 }, style: { fill: cfCharts.c('blue') } },
        { type: 'text', x: 18, y: 2, style: { text: 'right', fill: cfCharts.c('ink'), font: '13px ' + cfCharts.base().textStyle.fontFamily } },
        { type: 'rect', shape: { x: 62, y: 2, width: 12, height: 12, r: 2 }, style: { fill: cfCharts.c('orange') } },
        { type: 'text', x: 80, y: 2, style: { text: 'wrong', fill: cfCharts.c('ink'), font: '13px ' + cfCharts.base().textStyle.fontFamily } }
      ] }],
      tooltip: cfCharts.tooltip({ trigger: 'item', formatter: function (p) {
        var r = p.data.r, rule = p.data.rule, kept = r.keeps[rule.key];
        var verdict = function (ok) { return ok ? 'right' : '<b>wrong</b>'; };
        return '<b>Building ' + r.g + '</b>' + (r.name ? ' (' + r.name + ')' : '') + ' · ' + r.n + ' plan' + (r.n > 1 ? 's' : '') +
          '<br>Whole site: score ' + r.whole_score.toFixed(2) + ', ' + verdict(r.right.whole) +
          '<br>Building by building: score ' + r.pairwise_score.toFixed(2) +
          (r.pairwise_placed < r.n ? ' (' + r.pairwise_placed + ' of ' + r.n + ' plans placed)' : '') + ', ' + verdict(r.right.pairwise) +
          '<br><i>' + rule.label + '</i> keeps ' + ATTEMPT[kept] + ': ' + verdict(r.right[kept]);
      } }),
      xAxis: { type: 'category', data: groups.map(function (r) { return r.g; }), name: 'Building',
               nameLocation: 'middle', nameGap: 46, nameTextStyle: { color: cfCharts.c('text-secondary') },
               axisLine: { show: false }, axisTick: { show: false },
               axisLabel: { color: cfCharts.c('text-secondary'), fontSize: 10, interval: 0, rotate: 90 } },
      yAxis: { type: 'category', data: RULES.map(function (rule) { return rule.label; }),
               axisLine: { show: false }, axisTick: { show: false },
               axisLabel: { fontSize: 13, formatter: function (label, k) {
                 var rule = RULES[k];
                 return '{name|' + label + '}  {count|' + tally[rule.key] + '/' + d.groups.length + '}';
               }, rich: { name: { color: cfCharts.c('ink'), fontSize: 13 },
                          count: { color: cfCharts.c('ink'), fontSize: 13, fontWeight: 700 } } } },
      series: [{
        id: 'cells', type: 'custom', data: cells,
        encode: { x: 0, y: 1 },
        renderItem: function (params, api) {
          var c = cells[params.dataIndex], xy = api.coord([api.value(0), api.value(1)]), size = api.size([1, 1]);
          var w = Math.min(size[0], size[1] * 1.4) * 0.82, h = size[1] * 0.7;
          var ok = rightUnder(c.r, c.rule.key);
          return { type: 'rect', shape: { x: xy[0] - w / 2, y: xy[1] - h / 2, width: w, height: h, r: 2 },
                   style: { fill: cfCharts.c(ok ? 'blue' : 'orange') } };
        }
      }]
    });
  });
});
