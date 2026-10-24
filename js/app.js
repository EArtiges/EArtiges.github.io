/* Load particles.json, recolor it with the CityFlux accent, then start particles.js.
   Restarts with the new accent whenever the light/dark mode changes. */
var particlesConfig = null;

function startParticles() {
  if (!particlesConfig) return;
  if (window.pJSDom && window.pJSDom.length) {
    window.pJSDom[0].pJS.fn.vendors.destroypJS();
    window.pJSDom = [];
  }
  particlesConfig.particles.color.value = cfTheme.hex('accent');
  particlesConfig.particles.line_linked.color = cfTheme.hex('accent');
  particlesJS('particles-js', particlesConfig);
}

fetch('/js/particles.json')
  .then(function (response) { return response.json(); })
  .then(function (config) {
    particlesConfig = config;
    startParticles();
  });

window.addEventListener('cf-theme-change', startParticles);
