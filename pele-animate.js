// Post-processor for SVG produced by pele's render()/mount(). Timeline: nodes appear by BFS level, each edge draws from its
// source once the source is up, the target appears as the edge lands. Sequence diagrams: actors, then messages in order.
const NS = 'http://www.w3.org/2000/svg';
const UNIT = 0.8; // seconds per BFS level / message
const MAX_INTRO = 3; // a long diagram squeezes its steps so the intro never runs past about this many seconds
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

// Spike: icon nodes sized with `h: 88` get a frame of that size; let the glyph fill it and hide the frame so the glyph is the art.
function fitGlyphs(svg) {
  svg.querySelectorAll('.pele-node').forEach((n) => {
    const g = n.querySelector(':scope > svg.pele-icon');
    const frame = g?.previousElementSibling;
    if (!g || frame?.tagName !== 'rect' || +frame.getAttribute('width') < 60) return;
    for (const a of ['x', 'y', 'width', 'height']) g.setAttribute(a, frame.getAttribute(a));
    n.classList.add('pa-art');
  });
}

// Pele sizes each sequence participant box to its own text, which leaves ragged rows. Give every box in a row the tallest height:
// header boxes grow upward (bottoms stay on the lifeline start), footer boxes grow downward (tops stay on the lifeline end).
function equalizeActors(svg) {
  if (!svg.classList.contains('pele-sequence') || svg.dataset.paEqualized) return;
  svg.dataset.paEqualized = '1';
  for (const footer of [false, true]) {
    const boxes = [...svg.querySelectorAll('g.pele-actor-participant')].filter((g) => g.classList.contains('pele-actor-footer') === footer);
    const rects = boxes.map((g) => g.querySelector('rect')).filter(Boolean);
    if (rects.length < 2) continue;
    const num = (r, a) => +r.getAttribute(a);
    const heights = rects.map((r) => num(r, 'height'));
    const max = Math.max(...heights);
    const top = Math.min(...rects.map((r) => num(r, 'y')));
    const bottom = Math.max(...rects.map((r) => num(r, 'y') + num(r, 'height')));
    boxes.forEach((g, i) => {
      const grow = max - heights[i];
      if (!grow) return;
      rects[i].setAttribute('y', String(footer ? top : bottom - max));
      rects[i].setAttribute('height', String(max));
      const dy = footer ? grow / 2 : -grow / 2; // re-centre the label
      g.querySelectorAll('text, tspan').forEach((t) => {
        const y = t.getAttribute('y');
        if (y !== null) t.setAttribute('y', String(+y + dy));
      });
    });
  }
}

export function animate(svg, { hover = svg, source = '' } = {}) {
  fitGlyphs(svg);
  equalizeActors(svg);
  svg.querySelectorAll('.pa-dot').forEach((d) => d.remove());
  svg.classList.add('pa-ready');
  const nodes = [...svg.querySelectorAll('.pele-node')];
  const edges = [...svg.querySelectorAll('.pele-edge')];
  const ids = [...new Set(nodes.map((n) => n.dataset.id))];
  const set = (el, t) => el?.style.setProperty('--d', `${t}s`);
  const times = new Map(); // edge element -> start time
  const step = new Map(); // node / edge element -> step index (BFS level, or message number in a sequence)

  if (svg.classList.contains('pele-sequence')) {
    const u = Math.min(UNIT, MAX_INTRO / Math.max(1, edges.length));
    nodes.forEach((n) => set(n, 0));
    svg.querySelectorAll('.pele-lifeline').forEach((l) => set(l, 0.2));
    edges.forEach((e, i) => { times.set(e, 0.5 + i * u); step.set(e, i + 1); });
    nodes.forEach((n) => step.set(n, 0));
  } else {
    const pairs = edges.map((e) => endpoints(e.dataset.id, ids));
    const level = bfs(ids, pairs.filter(Boolean), parseOrder(source));
    const u = Math.min(UNIT, MAX_INTRO / (Math.max(0, ...level.values()) + 1));
    const k = u / UNIT;
    nodes.forEach((n) => { set(n, level.get(n.dataset.id) * u); step.set(n, level.get(n.dataset.id)); });
    // Start after the source is up, but never so early that the arrow lands before its target appears (pinned steps).
    edges.forEach((e, i) => {
      const [s, d] = pairs[i] ?? [];
      step.set(e, Math.max(level.get(s) ?? 0, level.get(d) ?? 0));
      times.set(e, Math.max((level.get(s) ?? 0) * u + 0.3 * k, (level.get(d) ?? 0) * u - 0.5 * k));
    });
  }

  const labels = new Map([...svg.querySelectorAll('.pele-edge-label')].map((l) => [l.dataset.id, l]));

  // Step mode: each step's elements are revealed together; [element, parts that animate in].
  const groups = new Map();
  const add = (n, el, pop = [el]) => el && (groups.get(n) ?? groups.set(n, []).get(n)).push([el, pop]);
  nodes.forEach((n) => add(step.get(n), n));
  svg.querySelectorAll('.pele-lifeline').forEach((l) => add(0, l));
  for (const e of edges) { add(step.get(e), e, [...e.querySelectorAll('path')]); add(step.get(e), labels.get(e.dataset.id)); }
  svg.paSteps = [...groups].sort((a, b) => a[0] - b[0]).map(([, items]) => items);

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
    if (reduced() || running.length || svg.classList.contains('pa-step')) return;
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

const STEP_MS = 1200; // autoplay pace in step mode

// Show steps 0..k and hide the rest; `pop` animates the elements of step k.
function showStep(svg, k, pop) {
  svg.classList.add('pa-step');
  svg.querySelectorAll('.pa-pop').forEach((el) => el.classList.remove('pa-pop'));
  svg.paSteps.forEach((items, i) => items.forEach(([el]) => el.classList.toggle('pa-hid', i > k)));
  void svg.getBoundingClientRect();
  if (pop) svg.paSteps[k].forEach(([, parts]) => parts.forEach((p) => p.classList.add('pa-pop')));
}

function leaveStep(svg) {
  svg.classList.remove('pa-step');
  svg.querySelectorAll('.pa-hid, .pa-pop').forEach((el) => el.classList.remove('pa-hid', 'pa-pop'));
  svg.classList.add('pa-in', 'pa-done');
}

// mount() re-renders on container resize; re-animate each new <svg>, skipping the intro once it has played.
// Click (or Enter/Space) enters step mode: previous | play/pause | next, Space, ←/→, Esc to leave. `controls: false` keeps click-to-replay.
export function watch(container, source = '', { controls = true } = {}) {
  let played = false;
  let k = -1; // current step; -1 = not in step mode
  let timer = 0;
  const cur = () => container.querySelector('svg.pele');
  const bar = document.createElement('div');
  bar.className = 'pa-controls';
  bar.setAttribute('role', 'toolbar');
  bar.setAttribute('aria-label', 'Step through the diagram');
  bar.title = ''; // an empty title stops the container's tooltip showing through the gaps
  bar.innerHTML = '<button type="button" data-a="prev" aria-label="Previous step" title="Previous step (\u2190)">\u2039</button>'
    + '<button type="button" data-a="play"></button>'
    + '<button type="button" data-a="next" aria-label="Next step" title="Next step (\u2192)">\u203A</button>'
    + '<span class="pa-count" aria-live="polite" title="Current step"></span>'
    + '<button type="button" data-a="exit" aria-label="Exit step mode" title="Exit step mode (Esc)">\u2715\uFE0E</button>';
  const btn = (a) => bar.querySelector(`[data-a=${a}]`);
  const last = () => (cur()?.paSteps?.length ?? 1) - 1;
  const ui = () => {
    btn('prev').disabled = k <= 0;
    btn('next').disabled = k >= last();
    btn('play').textContent = timer ? '\u275A\u275A' : '\u25B6\uFE0E';
    const label = timer ? 'Pause (Space)' : 'Play (Space)';
    btn('play').setAttribute('aria-label', label);
    btn('play').title = label;
    bar.querySelector('.pa-count').textContent = `${k + 1} / ${last() + 1}`;
  };
  const pause = () => { clearTimeout(timer); timer = 0; };
  const go = (n) => {
    const svg = cur();
    if (!svg?.paSteps) return;
    const to = Math.max(0, Math.min(last(), n));
    showStep(svg, to, to > k);
    k = to;
    ui();
  };
  const tick = () => {
    if (k >= last()) { pause(); return ui(); }
    go(k + 1);
    timer = setTimeout(tick, STEP_MS);
  };
  const toggle = () => {
    if (timer) { pause(); return ui(); }
    if (k >= last()) go(0);
    timer = setTimeout(tick, STEP_MS);
    ui();
  };
  const manual = (n) => { pause(); go(n); };
  const enter = () => {
    played = true;
    container.classList.add('pa-stepping');
    container.append(bar);
    go(0);
  };
  const exit = () => {
    pause();
    k = -1;
    bar.remove();
    container.classList.remove('pa-stepping');
    if (cur()) leaveStep(cur());
    container.focus();
  };
  const actions = { prev: () => manual(k - 1), next: () => manual(k + 1), play: toggle, exit };
  bar.addEventListener('click', (e) => {
    e.stopPropagation(); // else the container's click would re-enter step mode right after Exit
    actions[e.target.closest('button')?.dataset.a]?.();
  });

  const run = () => {
    if (k >= 0 && !bar.isConnected) container.append(bar); // a re-render may have wiped it
    const svg = container.querySelector('svg.pele:not(.pa-ready)');
    if (!svg) return;
    animate(svg, { hover: container, source });
    if (played) svg.classList.add('pa-in', 'pa-done');
    else svg.addEventListener('animationend', () => (played = true), { once: true });
    if (k >= 0) { k = Math.min(k, last()); showStep(svg, k, false); ui(); }
  };
  new MutationObserver(run).observe(container, { childList: true });
  container.classList.add('pa-scene');
  container.tabIndex = 0;
  container.title ||= controls ? 'Click to step through' : 'Click to replay';
  if (!controls) {
    container.addEventListener('click', () => replay(cur()));
    container.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), replay(cur())));
  } else {
    container.addEventListener('click', () => k < 0 && enter());
    container.addEventListener('keydown', (e) => {
      const key = e.key;
      if (e.target.closest('button') && (key === 'Enter' || key === ' ')) return; // native button activation
      if (k < 0) return (key === 'Enter' || key === ' ') && (e.preventDefault(), enter());
      const act = { ' ': toggle, ArrowRight: () => manual(k + 1), ArrowLeft: () => manual(k - 1), Escape: exit }[key];
      if (act) { e.preventDefault(); act(); }
    });
  }
  run();
}

// Play the intro again (removing pa-in/pa-done restarts the CSS animations).
export function replay(svg) {
  if (!svg || reduced()) return;
  svg.classList.remove('pa-in', 'pa-done');
  void svg.getBoundingClientRect();
  svg.classList.add('pa-in');
}
