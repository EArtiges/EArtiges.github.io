// CityFlux color tokens for canvas code (p5.js sketches, particles header),
// plus the header's light/dark toggle.
// Reads the CSS custom properties defined in _sass/minima/_theme.scss, so
// canvases follow the same palette and light/dark mode as the rest of the site.
//
//   p.fill(...cfTheme.rgb('accent'), alpha);
//   cfTheme.hex('accent'); // "#29339B"
//
// Loaded synchronously in <head> so a saved choice applies before first paint.
// Listen for the 'cf-theme-change' event on window to redraw on a mode switch.

var cfTheme = (function () {
  var STORAGE_KEY = 'cf-theme';
  var root = document.documentElement;
  var query = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var cache = null;

  function load() {
    var style = getComputedStyle(root);
    var names = ['bg', 'surface', 'ink', 'text-secondary', 'muted', 'rule',
                 'accent', 'accent-strong', 'accent-tint', 'blue', 'magenta', 'yellow', 'orange'];
    cache = {};
    names.forEach(function (name) {
      var hex = style.getPropertyValue('--cf-' + name).trim();
      cache[name] = { hex: hex, rgb: hexToRgb(hex) };
    });
  }

  function hexToRgb(hex) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function token(name) {
    if (!cache) load();
    return cache[name];
  }

  function savedMode() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function currentMode() {
    var forced = root.getAttribute('data-theme');
    if (forced) return forced;
    return query && query.matches ? 'dark' : 'light';
  }

  function changed() {
    cache = null;
    updateToggle();
    window.dispatchEvent(new Event('cf-theme-change'));
  }

  function setMode(mode) {
    root.setAttribute('data-theme', mode);
    try { localStorage.setItem(STORAGE_KEY, mode); } catch (e) {}
    changed();
  }

  // The button names the mode it switches to.
  function updateToggle() {
    var button = document.getElementById('theme-toggle');
    if (button) button.textContent = currentMode() === 'dark' ? 'Light' : 'Dark';
  }

  var saved = savedMode();
  if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);

  if (query) {
    if (query.addEventListener) query.addEventListener('change', changed);
    else if (query.addListener) query.addListener(changed);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var button = document.getElementById('theme-toggle');
    if (!button) return;
    updateToggle();
    button.addEventListener('click', function () {
      setMode(currentMode() === 'dark' ? 'light' : 'dark');
    });
  });

  return {
    hex: function (name) { return token(name).hex; },
    rgb: function (name) { return token(name).rgb; },
    mode: currentMode
  };
})();
