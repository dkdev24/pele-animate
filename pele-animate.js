// Post-processor for SVG produced by pele's render()/mount(). Timeline: nodes appear by BFS level, each edge draws from its
// source once the source is up, the target appears as the edge lands. Sequence diagrams: actors, then messages in order.
const NS = 'http://www.w3.org/2000/svg';
const UNIT = 0.8; // seconds per BFS level / message
const TOKEN = 0.5; // seconds a token takes to cross an edge
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// `%% pa: 1=A,B 2=C` pins nodes to steps (1-based); returns Map(nodeId -> level). Everything else keeps its BFS level.
export function parseOrder(source = '') {
  const m = source.match(/^\s*%%\s*pa:\s*(.+)$/m);
  const levels = new Map();
  for (const [, step, ids] of (m?.[1] ?? '').matchAll(/(\d+)\s*=\s*([^\s]+)/g))
    for (const id of ids.split(',')) levels.set(id.trim(), Number(step) - 1);
  return levels;
}

function endpoints(edgeId, ids) {
  for (const s of ids) for (const d of ids) if (new RegExp(`^L_${s}_${d}_\\d+$`).test(edgeId)) return [s, d];
  return null;
}

function bfs(ids, pairs, pinned) {
  const level = new Map(pinned);
  const hasIn = new Set(pairs.map(([, d]) => d));
  let queue = ids.filter((i) => !hasIn.has(i));
  if (!queue.length && ids.length) queue = [ids[0]];
  for (const q of queue) if (!level.has(q)) level.set(q, 0);
  while (queue.length) {
    const next = [];
    for (const s of queue)
      for (const [a, d] of pairs)
        if (a === s && !level.has(d)) { level.set(d, level.get(s) + 1); next.push(d); }
    queue = next;
  }
  for (const i of ids) if (!level.has(i)) level.set(i, 0);
  return level;
}

export function animate(svg, { hover = svg, source = '' } = {}) {
  svg.querySelectorAll('.pa-dot').forEach((d) => d.remove());
  svg.classList.add('pa-ready');
  const nodes = [...svg.querySelectorAll('.pele-node')];
  const edges = [...svg.querySelectorAll('.pele-edge')];
  const ids = [...new Set(nodes.map((n) => n.dataset.id))];
  const set = (el, t) => el?.style.setProperty('--d', `${t}s`);
  const times = new Map(); // edge element -> start time

  if (svg.classList.contains('pele-sequence')) {
    nodes.forEach((n) => set(n, 0));
    svg.querySelectorAll('.pele-lifeline').forEach((l) => set(l, 0.2));
    edges.forEach((e, i) => times.set(e, 0.5 + i * UNIT));
  } else {
    const pairs = edges.map((e) => endpoints(e.dataset.id, ids));
    const level = bfs(ids, pairs.filter(Boolean), parseOrder(source));
    nodes.forEach((n) => set(n, level.get(n.dataset.id) * UNIT));
    // Start after the source is up, but never so early that the arrow lands before its target appears (pinned steps).
    edges.forEach((e, i) => {
      const [s, d] = pairs[i] ?? [];
      times.set(e, Math.max((level.get(s) ?? 0) * UNIT + 0.3, (level.get(d) ?? 0) * UNIT - 0.5));
    });
  }

  const labels = new Map([...svg.querySelectorAll('.pele-edge-label')].map((l) => [l.dataset.id, l]));
  const dots = [];
  for (const [e, t] of times) {
    const path = e.querySelector('path:not(.pele-marker)');
    if (!path) continue;
    path.style.setProperty('--len', path.getTotalLength());
    set(path, t);
    set(e.querySelector('.pele-marker'), t + 0.3);
    set(labels.get(e.dataset.id), t);
    const dot = document.createElementNS(NS, 'circle');
    dot.setAttribute('class', 'pa-dot');
    dot.setAttribute('r', '3');
    dot.style.offsetPath = `path("${path.getAttribute('d')}")`;
    e.append(dot);
    dots.push([dot, t]);
  }

  // Hover loop: tokens cross the edges in timeline order, then a pause, then again.
  const cycle = Math.max(0, ...times.values()) + TOKEN + 0.8;
  let running = [];
  const play = () => {
    if (reduced() || running.length) return;
    running = dots.map(([dot, t]) => {
      const a = t / cycle, b = (t + TOKEN) / cycle, e = 0.001;
      return dot.animate(
        [
          { offset: 0, opacity: 0, offsetDistance: '0%' },
          { offset: a, opacity: 0, offsetDistance: '0%' },
          { offset: a + e, opacity: 1, offsetDistance: '0%' },
          { offset: b, opacity: 1, offsetDistance: '100%' },
          { offset: b + e, opacity: 0, offsetDistance: '100%' },
          { offset: 1, opacity: 0, offsetDistance: '100%' },
        ],
        { duration: cycle * 1000, iterations: Infinity }
      );
    });
  };
  const stop = () => { running.forEach((a) => a.cancel()); running = []; };
  hover.addEventListener('pointerenter', play);
  hover.addEventListener('pointerleave', stop);
  hover.addEventListener('focusin', play);
  hover.addEventListener('focusout', stop);

  if (!('IntersectionObserver' in window)) return svg.classList.add('pa-in');
  svg.classList.remove('pa-in');
  const io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { svg.classList.add('pa-in'); io.disconnect(); }
  }, { threshold: 0.3 });
  io.observe(svg);
}

// mount() re-renders on container resize; re-animate each new <svg>, skipping the intro once it has played.
export function watch(container, source = '') {
  let played = false;
  const run = () => {
    const svg = container.querySelector('svg.pele:not(.pa-ready)');
    if (!svg) return;
    animate(svg, { hover: container, source });
    if (played) svg.classList.add('pa-in', 'pa-done');
    else svg.addEventListener('animationend', () => (played = true), { once: true });
  };
  new MutationObserver(run).observe(container, { childList: true });
  run();
}
