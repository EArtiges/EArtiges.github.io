/* Load particles.json, recolor it with the CityFlux accent, then start particles.js
   in the header (#particles-js) and in any <div data-banner="bubbles"> with an id
   (the banners post shows it next to the ones I didn't keep), plus the original
   version in any <div data-banner="bubbles-original">.
   Restarts with the new accent whenever the light/dark mode changes.
   Particles near the cursor become more opaque, with a Gaussian of their distance
   to it (particles.js's own hover modes are off: its bubble mode inflates them). */
var particlesConfig = null;
var particlesCursor = null;  // cursor position in viewport CSS px, null when away
var HOVER_SIGMA = 95;        // CSS px, width of the cursor's glow: 2σ ≈ 190 px ≈ 5 cm on screen
var HOVER_OPACITY = 0.85;    // opacity of a particle right under the cursor

function glowNearCursor(pJS) {
  var draw = pJS.fn.particlesDraw;
  pJS.fn.particlesDraw = function () {
    var ratio = pJS.canvas.pxratio;
    var sigma = HOVER_SIGMA * ratio;
    var box = particlesCursor && pJS.canvas.el.getBoundingClientRect();
    pJS.particles.array.forEach(function (p) {
      if (!particlesCursor) { p.opacity_bubble = undefined; return; }
      var dx = p.x - (particlesCursor.x - box.left) * ratio;
      var dy = p.y - (particlesCursor.y - box.top) * ratio;
      var near = Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
      p.opacity_bubble = p.opacity + (HOVER_OPACITY - p.opacity) * near;
    });
    draw();
  };
}

function startParticles() {
  if (!particlesConfig) return;
  // Stop the running loops ourselves: particles.js's destroypJS removes the last
  // canvas it created, not its own. particlesJS() replaces each container's canvas.
  (window.pJSDom || []).forEach(function (dom) { cancelAnimationFrame(dom.pJS.fn.drawAnimFrame); });
  window.pJSDom = [];
  particlesConfig.particles.color.value = cfTheme.hex('accent');
  particlesConfig.particles.line_linked.color = cfTheme.hex('accent');
  document.querySelectorAll('#particles-js, [data-banner="bubbles"]').forEach(function (el) {
    particlesJS(el.id, particlesConfig);
    glowNearCursor(window.pJSDom[window.pJSDom.length - 1].pJS);
  });
  // The original banner, kept in the banners post: particles.js's bubble mode on hover.
  document.querySelectorAll('[data-banner="bubbles-original"]').forEach(function (el) {
    var config = JSON.parse(JSON.stringify(particlesConfig));
    config.interactivity.events.onhover.enable = true;
    particlesJS(el.id, config);
  });
}

fetch('/js/particles.json', { cache: 'no-cache' })
  .then(function (response) { return response.json(); })
  .then(function (config) {
    particlesConfig = config;
    // This script runs in the header, before the post's containers exist.
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startParticles);
    else startParticles();
  });

window.addEventListener('cf-theme-change', startParticles);

// Tracked over the whole window, so particles also glow with the cursor just outside a banner.
window.addEventListener('mousemove', function (event) {
  particlesCursor = { x: event.clientX, y: event.clientY };
});
document.documentElement.addEventListener('mouseleave', function () { particlesCursor = null; });
