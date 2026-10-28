/* F3: every building's final score (whole site first), one dot each, stacked by score:
   blue = the placement is right, orange = wrong (answer key, or hand label where there is none).
   A draggable threshold splits "placed automatically" (right of it) from "sent to a person";
   the readout counts both sides. Buttons jump to preset thresholds. */
cfCharts.load('f3_threshold.json').then(function (d) {
  var BIN = 0.025, threshold = 0.7, total = d.groups.length;
  var height = {}, dots = d.groups.map(function (r) {
    var bin = Math.floor(r.score / BIN);
    height[bin] = (height[bin] || 0) + 1;
    return { value: [(bin + 0.5) * BIN, height[bin]], r: r };
  });
  var top = Math.max.apply(null, Object.keys(height).map(function (k) { return height[k]; }));

  function readout() {
    var auto = d.groups.filter(function (r) { return r.score >= threshold; });
    var review = d.groups.filter(function (r) { return r.score < threshold; });
    var rightAuto = auto.filter(function (r) { return r.right; }).length;
    var wrongReview = review.filter(function (r) { return !r.right; }).length;
    return 'Above ' + threshold.toFixed(2) + ': ' + auto.length + ' of ' + total + ' placed automatically (' +
      Math.round(100 * auto.length / total) + '%), ' + rightAuto + ' of them right\n' +
      'Below: ' + review.length + ' sent to a person, ' + wrongReview + ' of them wrong';
  }

  var fig = cfCharts.chart('f3', function () {
    var font = cfCharts.base().textStyle.fontFamily;
    return Object.assign(cfCharts.base(), {
      grid: { left: 24, right: 24, top: 64, bottom: 48 },
      tooltip: cfCharts.tooltip({ trigger: 'item', formatter: function (p) {
        if (!p.data || !p.data.r) return '';
        var r = p.data.r;
        return '<b>Building ' + r.g + '</b>' + (r.name ? ' (' + r.name + ')' : '') +
          '<br>Score ' + r.score.toFixed(2) + ', placed ' + (r.kept === 'whole' ? 'as a whole site' : 'building by building') +
          '<br>' + (r.right ? 'Right' : '<b>Wrong</b>') + ' (' + r.source + ')';
      } }),
      xAxis: cfCharts.axis('Score', { min: 0, max: 1, interval: 0.1 }),
      yAxis: { type: 'value', min: 0, max: top + 1, show: false },
      graphic: [{ id: 'readout', type: 'text', left: 24, top: 8,
                  style: { text: readout(), fill: cfCharts.c('ink'), font: '600 13px ' + font, lineHeight: 20 } }],
      series: [{
        id: 'dots', type: 'scatter', symbolSize: 11,
        data: dots.map(function (dot) {
          return { value: dot.value, r: dot.r, itemStyle: { color: cfCharts.c(dot.r.right ? 'blue' : 'orange') } };
        }),
        markArea: { silent: true, itemStyle: { color: cfCharts.rgba('ink', 0.06) },
                    label: { show: true, position: 'insideTopLeft', color: cfCharts.c('text-secondary'), fontSize: 12 },
                    data: [[{ name: 'Sent to a person', xAxis: 0 }, { xAxis: threshold }]] },
        markLine: { silent: true, symbol: 'none', animation: false,
                    lineStyle: { color: cfCharts.c('ink'), width: 2, type: 'solid' },
                    label: { formatter: threshold.toFixed(2), color: cfCharts.c('ink') },
                    data: [{ xAxis: threshold }] }
      }]
    });
  });

  // Drag handle: an invisible wide bar over the threshold line, moved horizontally.
  function handle() {
    var grid = fig.chart.getModel().getComponent('grid').coordinateSystem.getRect();
    var x = fig.chart.convertToPixel({ xAxisIndex: 0 }, threshold);
    fig.chart.setOption({ graphic: [{ id: 'handle', type: 'rect', z: 100, draggable: 'horizontal', cursor: 'ew-resize',
      shape: { x: -8, y: grid.y, width: 16, height: grid.height }, x: x, y: 0,
      style: { fill: 'rgba(0,0,0,0)' },
      ondrag: function () {
        var v = fig.chart.convertFromPixel({ xAxisIndex: 0 }, this.x);
        setThreshold(Math.round(Math.min(0.99, Math.max(0.05, v)) * 100) / 100, false);
      },
      ondragend: function () { handle(); } }] });
  }
  function setThreshold(v, moveHandle) {
    threshold = v;
    fig.chart.setOption({
      graphic: [{ id: 'readout', style: { text: readout() } }],
      series: [{ id: 'dots',
                 markArea: { data: [[{ name: 'Sent to a person', xAxis: 0 }, { xAxis: threshold }]] },
                 markLine: { label: { formatter: threshold.toFixed(2) }, data: [{ xAxis: threshold }] } }]
    });
    if (moveHandle) handle();
  }
  handle();
  window.addEventListener('cf-theme-change', function () { setTimeout(handle, 0); });
  window.addEventListener('resize', function () { setTimeout(handle, 0); });
  cfCharts.buttons('f3-controls', ['0.60', '0.70', '0.80'], function (v) { setThreshold(+v, true); }, '0.70');
});
