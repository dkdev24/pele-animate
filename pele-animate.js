// Post-processor for SVG produced by pele's render()/mount(). Call again after a re-layout (see watch()).
const NS = 'http://www.w3.org/2000/svg';
const STEP = 0.12;

export function animate(svg, { hover = svg } = {}) {
  svg.querySelectorAll('.pa-dot').forEach((d) => d.remove());
  svg.classList.add('pa-ready');
  const edges = [...svg.querySelectorAll('.pele-edge')];
  const nodes = [...svg.querySelectorAll('.pele-node')];
  // ponytail: order = DOM order (source order). Upgrade: BFS from source nodes via edge data-ids for true flow order.
  nodes.forEach((n, i) => n.style.setProperty('--d', `${i * STEP}s`));
  const labels = new Map([...svg.querySelectorAll('.pele-edge-label')].map((l) => [l.dataset.id, l]));
  edges.forEach((e, i) => {
    const d = `${(i + 0.5) * STEP}s`;
    const path = e.querySelector('path:not(.pele-marker)');
    if (!path) return;
    const len = path.getTotalLength();
    path.style.setProperty('--len', len);
    path.style.setProperty('--d', d);
    e.querySelector('.pele-marker')?.style.setProperty('--d', `${(i + 1) * STEP + 0.4}s`);
    labels.get(e.dataset.id)?.style.setProperty('--d', d);
    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('class', 'pa-dot');
    dot.setAttribute('r', '3');
    dot.style.offsetPath = `path("${path.getAttribute('d')}")`;
    dot.style.setProperty('--d', `${i * 0.4}s`);
    e.append(dot);
  });
  const on = () => svg.classList.add('pa-hover');
  const off = () => svg.classList.remove('pa-hover');
  hover.addEventListener('pointerenter', on);
  hover.addEventListener('pointerleave', off);
  hover.addEventListener('focusin', on);
  hover.addEventListener('focusout', off);
  if (!('IntersectionObserver' in window)) return svg.classList.add('pa-in');
  svg.classList.remove('pa-in');
  const io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { svg.classList.add('pa-in'); io.disconnect(); }
  }, { threshold: 0.3 });
  io.observe(svg);
}

// mount() re-renders the SVG on container resize; re-animate when a new <svg> appears (already-played ones skip draw-in).
export function watch(container) {
  let played = false;
  new MutationObserver(() => {
    const svg = container.querySelector('svg.pele:not(.pa-ready)');
    if (!svg) return;
    animate(svg, { hover: container });
    if (played) svg.classList.add('pa-in');
  }).observe(container, { childList: true });
  const svg = container.querySelector('svg.pele');
  if (svg) {
    animate(svg, { hover: container });
    svg.addEventListener('animationend', () => (played = true), { once: true });
  }
}
