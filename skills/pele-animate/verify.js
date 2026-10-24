// Evaluate in the page (e.g. `agent-browser eval "$(cat verify.js)"` or Playwright page.evaluate): did pele-animate render?
// Expect: diagrams = how many you added, every steps entry > 0, emptyIcons = [], and no name in `fallbackIcons` you meant to be real.
(() => {
  const svgs = [...document.querySelectorAll('.pa-scene svg.pele')];
  const icons = [...document.querySelectorAll('.pa-scene svg.pele-icon[data-icon]')];
  // An unregistered name renders pele-animate's neutral rounded square: one <rect x="4" y="4" ...> and nothing else.
  const fallback = (i) => /^<g[^>]*><rect x="4" y="4" width="16" height="16" rx="4"(\/>|><\/rect>)<\/g>$/.test(i.innerHTML.trim());
  return JSON.stringify({
    diagrams: svgs.length,
    steps: svgs.map((s) => s.paSteps?.length ?? 0),
    emptyIcons: icons.filter((i) => !i.innerHTML.trim()).map((i) => i.dataset.icon),
    fallbackIcons: icons.filter(fallback).map((i) => i.dataset.icon),
  });
})()
