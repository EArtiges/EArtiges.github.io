/* "Signal waves", a header banner tried in October 2026 and not kept (see the
   post "The banners I didn't keep"). It draws into <div data-banner="signal-waves">.

   Drifting dots with no links of their own. Every few seconds a
   dot at one edge fires, and the signal hops from dot to dot towards the other
   edge, left or right at random for each wave: each hop draws a link that
   grows from sender to receiver in the sender's colour, and the receiver
   lights up blue, yellow or magenta at random. The main
   branch crosses the whole banner; side branches split off now and then and
   die after a few hops. Clicking the banner fires the dot closest to the click.
   Colours come from cfTheme and follow the light/dark toggle. */
(function () {
  var container = document.querySelector('[data-banner="signal-waves"]');
  if (!container) return;

  var LINK_DIST = 140;       // px, how far a signal can jump
  var SPEED = 0.12;          // px per ms, how fast a signal travels along a link
  var LINK_FADE = 6000;      // ms, how long a link lingers after delivering
  var FLASH = 700;           // ms, how long a dot glows after receiving
  var HIT = 1400;            // ms, how long a dot reached by a signal glows
  var REFRACTORY = 2500;     // ms, a dot ignores signals for this long after firing
  var SPREAD = 55 * Math.PI / 180; // a hop stays within this angle of the wave's direction
  var BRANCH = 0.5;          // probability that a dot starts or extends a side branch
  var SIDE_HOPS = 3;         // a side branch dies after this many hops
  var HOVER_SIGMA = 95;      // px, width of the cursor's glow: 2σ ≈ 190 px ≈ 5 cm on screen
  var WAVE_EVERY = [16000, 28000]; // ms between spontaneous waves
  var DOT_AREA = 5500;       // px² of banner per dot

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var canvas = document.createElement('canvas');
  canvas.style.display = 'block';
  container.appendChild(canvas);
  var ctx = canvas.getContext('2d');

  var width = 0, height = 0;
  var dots = [];
  var links = [];
  var LIT = ['blue', 'yellow', 'magenta']; // a dot lights up in one of these when it fires
  var palette = {};
  var nextWave = 0;
  var last = 0;
  var cursor = null;         // mouse position in canvas coordinates, null when away

  // Dots and links store token names, so a mode switch recolours them too.
  function readColor() {
    palette.muted = cfTheme.rgb('muted');
    LIT.forEach(function (name) { palette[name] = cfTheme.rgb(name); });
  }

  function rgba(a, c) {
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  function makeDot(x) {
    return {
      x: x === undefined ? rand(0, width) : x,
      y: rand(0, height),
      vx: rand(0.005, 0.03),   // a slow rightward drift, as before
      vy: rand(-0.008, 0.008),
      r: rand(2, 7),
      alpha: rand(0.12, 0.35),
      firedAt: -Infinity,
      hops: 0,                // hops the signal took to reach this dot, 0 for a wave's source
      lit: 'muted',            // the colour this dot lit up in when it last fired
      busyUntil: 0             // set while a signal is on its way to this dot
    };
  }

  function resize() {
    var ratio = window.devicePixelRatio || 1;
    width = container.clientWidth;
    height = container.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    var target = Math.max(12, Math.min(90, Math.round(width * height / DOT_AREA)));
    while (dots.length < target) dots.push(makeDot());
    if (dots.length > target) dots.length = target;
    links = [];
    if (reduceMotion) draw(performance.now());
  }

  function distance(a, b) {
    var dx = a.x - b.x, dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // dir is +1 for a wave travelling right, -1 for one travelling left.
  // side is 0 on the wave's main branch, else the hops since it split off.
  function fire(dot, now, hops, dir, side) {
    dot.firedAt = now;
    dot.hops = hops;
    dot.lit = LIT[Math.floor(Math.random() * LIT.length)];
    var ahead = dots.filter(function (other) {
      if (other === dot) return false;
      if (now - other.firedAt < REFRACTORY || other.busyUntil > now) return false;
      var dx = (other.x - dot.x) * dir, dy = other.y - dot.y;
      return dx > 0 && Math.abs(Math.atan2(dy, dx)) <= SPREAD;
    });
    ahead.sort(function (a, b) { return distance(dot, a) - distance(dot, b); });
    var near = ahead.filter(function (other) { return distance(dot, other) <= LINK_DIST; });

    function send(other, otherSide) {
      var travel = distance(dot, other) / SPEED;
      other.busyUntil = now + travel;
      links.push({ from: dot, to: other, start: now, travel: travel, hops: hops + 1,
                   dir: dir, side: otherSide, color: dot.lit, delivered: false });
      near = near.filter(function (o) { return o !== other; });
    }

    // The main branch always goes on, jumping further if no neighbour is close,
    // until it runs out of dots at the far edge.
    if (side === 0 && ahead.length) {
      send(near.length ? near[Math.floor(Math.random() * near.length)] : ahead[0], 0);
    }
    // Side branches split off now and then and die after a few hops.
    if (side < SIDE_HOPS && near.length && Math.random() < BRANCH) {
      send(near[Math.floor(Math.random() * near.length)], side + 1);
    }
  }

  function randomDir() { return Math.random() < 0.5 ? 1 : -1; }

  function update(now, dt) {
    dots.forEach(function (dot) {
      dot.x += dot.vx * dt;
      dot.y += dot.vy * dt;
      if (dot.x > width + 10) { dot.x = -10; dot.y = rand(0, height); }
      if (dot.y < -10) dot.y = height + 10;
      if (dot.y > height + 10) dot.y = -10;
    });

    // Relay after filtering: fire() adds links, which filter() would drop.
    var arrived = [];
    links = links.filter(function (link) {
      // A dot that wrapped around the banner would stretch the link across it.
      if (distance(link.from, link.to) > link.travel * SPEED * 1.5 + 20) return false;
      var arrival = link.start + link.travel;
      if (!link.delivered && now >= arrival) {
        link.delivered = true;
        arrived.push(link);
      }
      return now < arrival + LINK_FADE;
    });
    arrived.forEach(function (link) { fire(link.to, now, link.hops, link.dir, link.side); });

    if (now >= nextWave) {
      // Start at the edge the wave leaves from, so it crosses the whole banner.
      var dir = randomDir();
      var starts = dots.filter(function (dot) {
        return dir > 0 ? dot.x < width / 8 : dot.x > width * 7 / 8;
      });
      if (starts.length) fire(starts[Math.floor(Math.random() * starts.length)], now, 0, dir, 0);
      nextWave = now + rand(WAVE_EVERY[0], WAVE_EVERY[1]);
    }
  }

  function draw(now) {
    ctx.clearRect(0, 0, width, height);
    ctx.lineCap = 'round';

    links.forEach(function (link) {
      var t = Math.min(1, (now - link.start) / link.travel);
      var fade = link.delivered ? 1 - (now - link.start - link.travel) / LINK_FADE : 1;
      var a = link.from, b = link.to;
      var x = a.x + (b.x - a.x) * t, y = a.y + (b.y - a.y) * t;
      // Side branches are fainter, and thin out as they go.
      var strength = link.side ? 0.7 - 0.15 * link.side : 1;

      // A link takes the colour of the dot it starts from.
      ctx.strokeStyle = rgba(0.6 * strength * fade, palette[link.color]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(x, y);
      ctx.stroke();

      if (!link.delivered) {
        // The signal itself: a bright head at the tip of the growing link.
        ctx.fillStyle = rgba(0.9 * strength, palette[link.color]);
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    dots.forEach(function (dot) {
      var since = now - dot.firedAt;
      var flash = since < FLASH ? 1 - since / FLASH : 0;

      // Grey until first hit; a dot that fires keeps its colour for good, but
      // only glows for a while before fading back to its base opacity.
      var hit = since < HIT ? Math.min(1, 2 * (1 - since / HIT)) : 0;
      // Dots near the cursor brighten with a Gaussian of their distance to it.
      var near = cursor ? Math.exp(-Math.pow(distance(dot, cursor), 2) / (2 * HOVER_SIGMA * HOVER_SIGMA)) : 0;
      var glow = Math.max(flash, hit, near);
      ctx.fillStyle = rgba(dot.alpha + (0.85 - dot.alpha) * glow, palette[dot.lit]);
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      ctx.fill();

      if (flash > 0 && dot.hops === 0) {
        // A ring that expands and fades around the wave's source.
        ctx.strokeStyle = rgba(0.6 * flash, palette[dot.lit]);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r + (1 - flash) * 14, 0, Math.PI * 2);
        ctx.stroke();
      }
    });
  }

  function frame(now) {
    // Cap the step so a background tab doesn't teleport the dots on return.
    var dt = Math.min(50, now - (last || now));
    last = now;
    update(now, dt);
    draw(now);
    requestAnimationFrame(frame);
  }

  container.addEventListener('click', function (event) {
    var now = performance.now();
    if (reduceMotion) return;
    var box = canvas.getBoundingClientRect();
    var mouse = { x: event.clientX - box.left, y: event.clientY - box.top };
    var nearest = null, best = Infinity;
    dots.forEach(function (dot) {
      var d = distance(dot, mouse);
      if (d < best) { best = d; nearest = dot; }
    });
    if (nearest) fire(nearest, now, 0, randomDir(), 0);
  });

  // Tracked over the whole window, so dots also glow with the cursor just outside the banner.
  window.addEventListener('mousemove', function (event) {
    var box = canvas.getBoundingClientRect();
    cursor = { x: event.clientX - box.left, y: event.clientY - box.top };
    if (reduceMotion) draw(performance.now());
  });
  document.documentElement.addEventListener('mouseleave', function () {
    cursor = null;
    if (reduceMotion) draw(performance.now());
  });

  window.addEventListener('cf-theme-change', function () {
    readColor();
    if (reduceMotion) draw(performance.now());
  });
  window.addEventListener('resize', resize);

  readColor();
  resize();
  if (!reduceMotion) requestAnimationFrame(frame);
})();
