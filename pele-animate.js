// Post-processor for SVG produced by pele's render()/mount(). Timeline: nodes appear by BFS level, each edge draws from its
// source once the source is up, the target appears as the edge lands. Sequence diagrams: actors, then messages in order.
const NS = 'http://www.w3.org/2000/svg';
const UNIT = 0.8; // seconds per BFS level / message
const MAX_INTRO = 3; // a long diagram squeezes its steps so the intro never runs past about this many seconds
const TOKEN = 0.5; // seconds a token takes to cross an edge
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// `%% pa: 1=A,B 2=C 3=A>B` pins nodes to steps (1-based); `X>Y` pins the edge from X to Y. Returns Map(nodeId or 'X>Y' -> level).
// Everything else keeps its BFS level.
export function parseOrder(source = '') {
  const m = source.match(/^\s*%%\s*pa:\s*(.+)$/m);
  const levels = new Map();
  for (const [, step, ids] of (m?.[1] ?? '').matchAll(/(\d+)\s*=\s*([^\s]+)/g))
    for (const id of ids.split(',')) levels.set(id.trim(), Number(step) - 1);
  return levels;
}

// Edge ids by diagram type: flowchart `L_A_B_0`, architecture and C4 `A-B` (repeat edges get `-N`), block `1-A-B`, class `id_A_B_1`,
// ER `id_entity-A-0_entity-B-1_0`. Ends follow the written order (`A <|-- B` is A, then B).
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function endpoints(edgeId, ids) {
  for (const s of ids)
    for (const d of ids)
      if (new RegExp(`^(?:L_${esc(s)}_${esc(d)}_\\d+|(?:\\d+-)?${esc(s)}-${esc(d)}(?:-\\d+)?|id_${esc(s)}_${esc(d)}_\\d+|id_entity-${esc(s)}-\\d+_entity-${esc(d)}-\\d+_\\d+)$`).test(edgeId)) return [s, d];
  return null;
}

// State diagrams name edges `edge0`, `edge1`, ... with no ends in the id, so read the ends off the geometry:
// the node nearest to where the path starts (source) and ends (target).
function geoEndpoints(edge, boxes) {
  const path = edge.querySelector('path:not(.pele-marker)');
  if (!path) return null;
  const near = (pt) => {
    let best = null, bd = 12; // an end more than 12 px from every node is not an end
    for (const [id, b] of boxes) {
      const d = Math.hypot(Math.max(b.x - pt.x, 0, pt.x - b.x - b.width), Math.max(b.y - pt.y, 0, pt.y - b.y - b.height));
      if (d < bd) { bd = d; best = id; }
    }
    return best;
  };
  const s = near(path.getPointAtLength(0)), d = near(path.getPointAtLength(path.getTotalLength()));
  return s && d ? [s, d] : null;
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

// Pele sizes an icon node's layout box from its label alone but draws the icon at `h`, so a label narrower than the icon puts
// the edge ends (and arrowheads) under the icon. Pad such labels with non-breaking spaces so the box is at least `h` wide.
// Use as: mount(el, prepare(src), { icons }); keep passing the original `src` to watch().
const NBSP = '\u00a0';
const WJ = '\u2060'; // zero-width, not whitespace: keeps Pele from trimming the padding
export function prepare(source = '') {
  return source.replace(/@\{([^}]*)\}/g, (all, body) => {
    const h = +/\bh:\s*(\d+)/.exec(body)?.[1];
    if (!h) return all;
    const label = /\blabel:\s*"([^"]*)"/.exec(body)?.[1] ?? '';
    // ponytail: a character counts as ~7 px (a space too); a real measurer would be exact. Over-padding only widens the gap.
    const need = Math.ceil(h / 7) - label.length;
    if (need <= 0) return all;
    const pad = NBSP.repeat(Math.ceil(need / 2));
    const next = `label: "${WJ}${pad}${label}${pad}${WJ}"`;
    return `@{${/\blabel:/.test(body) ? body.replace(/\blabel:\s*"[^"]*"/, next) : `${body.replace(/\s*$/, '')}, ${next} `}}`;
  });
}


// Diagrams with no edges to follow (timeline, journey, gitGraph, gantt) step through their items in reading order.
// Returns [[element, ...], ...], one array per step, or null for any other diagram.
const pts = (path) => path.getAttribute('d').match(/-?[\d.]+/g)?.map(Number) ?? [];
function sequentialSteps(svg) {
  const all = (sel) => [...svg.querySelectorAll(sel)];
  if (svg.classList.contains('pele-timeline')) return all('.pele-period').map((p) => [p]);
  if (svg.classList.contains('pele-gantt')) return all('.pele-task').map((t) => [t]);
  if (svg.classList.contains('pele-journey')) {
    // Wide: tasks, faces and one polyline are separate. Narrow (vertical list): each step holds its face, edges join the steps.
    const tasks = all('.pele-task, .pele-journey-step');
    const faces = all('.pele-face').filter((f) => !f.closest('.pele-node'));
    // The satisfaction line is one polyline `M x,yL x,y...`: split it so each segment arrives with its task.
    const segs = [];
    for (const line of all('path.pele-edge')) {
      const d = line.getAttribute('d');
      if (!/^M[-\d.,]+(L[-\d.,]+)+$/.test(d)) { segs.push(line); continue; }
      const p = d.slice(1).split('L');
      for (let i = 1; i < p.length; i++) {
        const seg = line.cloneNode();
        seg.setAttribute('d', `M${p[i - 1]}L${p[i]}`);
        line.before(seg);
        segs.push(seg);
      }
      line.remove();
    }
    return tasks.map((t, i) => [t, faces[i], segs[i - 1]].filter(Boolean));
  }
  if (svg.classList.contains('pele-gitGraph')) {
    const commits = all('.pele-commit');
    const at = (c) => { const e = c.querySelector('circle'); return [+e.getAttribute('cx'), +e.getAttribute('cy')]; };
    const steps = commits.map((c) => [c]);
    // an edge arrives with the commit it ends on
    for (const e of all('.pele-edge')) {
      const path = e.matches('path') ? e : e.querySelector('path');
      const end = path.getPointAtLength(path.getTotalLength());
      let best = steps.length - 1, bd = Infinity;
      commits.forEach((c, i) => { const [x, y] = at(c), d = Math.hypot(x - end.x, y - end.y); if (d < bd) { bd = d; best = i; } });
      steps[best]?.push(e);
    }
    // a branch (label and lane) appears with its first commit: the commit whose y is on the lane
    for (const b of all('.pele-branch')) {
      const y = pts(b.querySelector('.pele-lane'))[1];
      const first = commits.findIndex((c) => Math.abs(at(c)[1] - y) < 1);
      steps[first < 0 ? 0 : first].push(b);
    }
    return steps;
  }
  return null;
}

// Intro for sequentialSteps: each step fades in after the one before; the same steps drive step mode.
function introSteps(svg, steps) {
  const u = Math.min(UNIT, MAX_INTRO / Math.max(1, steps.length));
  steps.forEach((els, i) => els.forEach((el) => { el.classList.add('pa-item'); el.style.setProperty('--d', `${i * u}s`); }));
  svg.paSteps = steps.map((els) => els.map((el) => [el, [el]]));
  reveal(svg);
}

function reveal(svg) {
  if (!('IntersectionObserver' in window)) return svg.classList.add('pa-in');
  svg.classList.remove('pa-in');
  const io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { svg.classList.add('pa-in'); io.disconnect(); }
  }, { threshold: 0.3 });
  io.observe(svg);
}

export function animate(svg, { hover = svg, source = '' } = {}) {
  fitGlyphs(svg);
  equalizeActors(svg);
  svg.querySelectorAll('.pa-dot').forEach((d) => d.remove());
  svg.classList.add('pa-ready');
  const seq = sequentialSteps(svg);
  if (seq) return introSteps(svg, seq);
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
    const boxes = new Map();
    const pairs = edges.map((e) => {
      const found = endpoints(e.dataset.id, ids);
      if (found) return found;
      if (!boxes.size)
        for (const n of nodes) {
          const b = n.getBBox(), t = n.transform.baseVal.consolidate()?.matrix;
          boxes.set(n.dataset.id, { x: b.x + (t?.e ?? 0), y: b.y + (t?.f ?? 0), width: b.width, height: b.height });
        }
      return geoEndpoints(e, boxes);
    });
    const level = bfs(ids, pairs.filter(Boolean), parseOrder(source));
    // An edge pin may name the ends in either order (`Video>Media` for `Media <|-- Video`, or either end of an undirected edge),
    // unless the diagram also has the opposite edge, where the order picks which of the two is meant.
    const real = new Set(pairs.filter(Boolean).map(([a, b]) => `${a}>${b}`));
    const pinOf = (s, d) => level.get(`${s}>${d}`) ?? (real.has(`${d}>${s}`) ? undefined : level.get(`${d}>${s}`));
    const u = Math.min(UNIT, MAX_INTRO / (Math.max(0, ...level.values()) + 1));
    const k = u / UNIT;
    nodes.forEach((n) => { set(n, level.get(n.dataset.id) * u); step.set(n, level.get(n.dataset.id)); });
    // Start after the source is up, but never so early that the arrow lands before its target appears (pinned steps).
    edges.forEach((e, i) => {
      const [s, d] = pairs[i] ?? [];
      const pin = pinOf(s, d); // edge pinned to a step: starts with that step, once its source is up
      step.set(e, pin ?? Math.max(level.get(s) ?? 0, level.get(d) ?? 0));
      times.set(e, pin !== undefined
        ? Math.max(pin * u, (level.get(s) ?? 0) * u + 0.3 * k)
        : Math.max((level.get(s) ?? 0) * u + 0.3 * k, (level.get(d) ?? 0) * u - 0.5 * k));
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

  reveal(svg);
}

const STEP_MS = 1200; // autoplay pace in step mode
// Control icons are SVG, not text glyphs: glyphs like ‹ and ▶ sit at different heights in every font.
const icon = (d, fill) => `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" ${fill ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"'}>${d}</svg>`;
const ICON = {
  prev: icon('<path d="M15 5l-7 7 7 7"/>'),
  next: icon('<path d="M9 5l7 7-7 7"/>'),
  play: icon('<path d="M8 5v14l11-7z"/>', 1),
  pause: icon('<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z"/>', 1),
  exit: icon('<path d="M6 6l12 12M18 6L6 18"/>'),
};

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
// Click (or Enter/Space) enters step mode: previous | play/pause | next, Space, ←/→, Esc to leave.
export function watch(container, source = '') {
  let played = false;
  let k = -1; // current step; -1 = not in step mode
  let timer = 0;
  const cur = () => container.querySelector('svg.pele');
  const bar = document.createElement('div');
  bar.className = 'pa-controls';
  bar.setAttribute('role', 'toolbar');
  bar.setAttribute('aria-label', 'Step through the diagram');
  bar.title = ''; // an empty title stops the container's tooltip showing through the gaps
  bar.innerHTML = '<button type="button" data-a="prev" aria-label="Previous step" title="Previous step (\u2190)">' + ICON.prev + '</button>'
    + '<button type="button" data-a="play"></button>'
    + '<button type="button" data-a="next" aria-label="Next step" title="Next step (\u2192)">' + ICON.next + '</button>'
    + '<span class="pa-count" aria-live="polite" title="Current step"></span>'
    + '<button type="button" data-a="exit" aria-label="Exit step mode" title="Exit step mode (Esc)">' + ICON.exit + '</button>';
  const btn = (a) => bar.querySelector(`[data-a=${a}]`);
  const last = () => (cur()?.paSteps?.length ?? 1) - 1;
  const ui = () => {
    // aria-disabled, not `disabled`: a disabled button passes hover to the container, whose tooltip then shows over it
    btn('prev').setAttribute('aria-disabled', String(k <= 0));
    btn('next').setAttribute('aria-disabled', String(k >= last()));
    btn('play').innerHTML = timer ? ICON.pause : ICON.play;
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
    container.classList.add('pa-stepping'); // CSS hides Pele's zoom controls: arrows/Esc would clash
    container.querySelector('.pele-zoom [aria-label="Reset zoom"]')?.click(); // leave no stale zoom behind
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
    const b = e.target.closest('button');
    if (b?.getAttribute('aria-disabled') !== 'true') actions[b?.dataset.a]?.();
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
  container.title ||= 'Click to step through';
  // Pele's zoom buttons live inside the container: their clicks must not enter step mode.
  container.addEventListener('click', (e) => k < 0 && !e.target.closest('.pele-zoom') && enter());
  container.addEventListener('keydown', (e) => {
    const key = e.key;
    if (e.target.closest('button') && (key === 'Enter' || key === ' ')) return; // native button activation
    if (k < 0) return (key === 'Enter' || key === ' ') && (e.preventDefault(), enter());
    const act = { ' ': toggle, ArrowRight: () => manual(k + 1), ArrowLeft: () => manual(k - 1), Escape: exit }[key];
    if (act) { e.preventDefault(); act(); }
  });
  run();
}
